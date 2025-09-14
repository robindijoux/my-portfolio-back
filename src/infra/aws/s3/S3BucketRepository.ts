import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  GetObjectCommand,
  HeadObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { env } from '../../../config/env';
import { 
  IFileRepository, 
  UploadFileParams, 
  UploadFileResult 
} from '../../../application/shared/file/IFileRepository';

@Injectable()
export class S3BucketRepository implements IFileRepository {
  private readonly logger = new Logger(S3BucketRepository.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor() {
    this.region = env.AWS.REGION;
    this.bucketName = env.AWS.S3.BUCKET_NAME;
    
    const accessKeyId = env.AWS.S3.ACCESS_KEY_ID;
    const secretAccessKey = env.AWS.S3.SECRET_ACCESS_KEY;
    
    if (!accessKeyId || !secretAccessKey || 
        accessKeyId === 'your-access-key-here' || 
        secretAccessKey === 'your-secret-key-here') {
      this.logger.warn('AWS credentials not configured properly. S3 operations will fail until real credentials are provided.');
      // On continue l'initialisation mais avec des credentials vides pour permettre le démarrage
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: accessKeyId && secretAccessKey && 
                   accessKeyId !== 'your-access-key-here' && 
                   secretAccessKey !== 'your-secret-key-here' ? {
        accessKeyId,
        secretAccessKey,
      } : undefined,
    });

    this.logger.log(`S3BucketRepository initialized with bucket: ${this.bucketName} in region: ${this.region}`);
  }

  async uploadFile(params: UploadFileParams): Promise<UploadFileResult> {
    try {
      const key = params.folder 
        ? `${params.folder}/${params.fileName}` 
        : params.fileName;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: params.file,
        ContentType: params.mimeType,
        // Métadonnées utiles pour l'administration
        Metadata: {
          originalName: params.fileName,
          uploadedAt: new Date().toISOString(),
        },
      });

      const result = await this.s3Client.send(command);
      
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      
      this.logger.log(`File uploaded successfully: ${key}`);
      
      return {
        url,
        fileName: key,
        size: params.file.length,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${params.fileName}`, error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async deleteFileByUrl(url: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(url);
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${url}`, error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  getFileUrl(fileName: string, folder?: string): string {
    const key = folder ? `${folder}/${fileName}` : fileName;
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async generateSignedUrl(
    fileName: string, 
    folder?: string, 
    expiresInSeconds: number = 3600
  ): Promise<string> {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });

      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL for: ${fileName}`, error);
      throw new Error(`Signed URL generation failed: ${error.message}`);
    }
  }

  // Méthodes de l'interface originale (pour compatibilité)
  async readFile(filePath: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      const response = await this.s3Client.send(command);
      const body = await response.Body?.transformToString();
      
      if (!body) {
        throw new Error('File content is empty');
      }

      return body;
    } catch (error) {
      this.logger.error(`Failed to read file: ${filePath}`, error);
      throw new Error(`Read failed: ${error.message}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
        Body: content,
        ContentType: 'text/plain',
      });

      await this.s3Client.send(command);
      this.logger.log(`File written successfully: ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to write file: ${filePath}`, error);
      throw new Error(`Write failed: ${error.message}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${filePath}`, error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  // Méthodes utilitaires privées
  private extractKeyFromUrl(url: string): string {
    // Extract key from S3 URL
    const urlPattern = new RegExp(`https://${this.bucketName}\\.s3\\.${this.region}\\.amazonaws\\.com/(.+)`);
    const match = url.match(urlPattern);
    
    if (!match) {
      throw new Error(`Invalid S3 URL format: ${url}`);
    }
    
    return match[1];
  }

  // Méthode pour vérifier si un fichier existe
  async fileExists(fileName: string, folder?: string): Promise<boolean> {
    try {
      const key = folder ? `${folder}/${fileName}` : fileName;
      
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      this.logger.error(`Error checking file existence: ${fileName}`, error);
      throw error;
    }
  }
}