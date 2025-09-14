import { Injectable, BadRequestException, NotFoundException, Logger, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Media } from '../../domain/project/media.entity';
import type { IMediaRepository } from '../../domain/project/media.repository';
import { IMEDIA_REPOSITORY } from '../../domain/project/media.repository';
import type { IFileRepository } from '../shared/file/IFileRepository';
import { IFILE_REPOSITORY } from '../shared/file/IFileRepository';

export interface UploadMediaParams {
  file: Buffer;
  originalName: string;
  mimeType: string;
  uploadedBy?: string;
  alt?: string;
  folder?: string;
}

export interface MediaUploadResult {
  media: Media;
  success: boolean;
  message: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  
  // Configurations de validation
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
  ];
  private readonly ALLOWED_VIDEO_TYPES = [
    'video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'
  ];
  private readonly ALLOWED_DOCUMENT_TYPES = [
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  constructor(
    @Inject(IMEDIA_REPOSITORY)
    private readonly mediaRepository: IMediaRepository,
    @Inject(IFILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
  ) {}

  async uploadMedia(params: UploadMediaParams): Promise<MediaUploadResult> {
    try {
      // Validation du fichier
      this.validateFile(params.file, params.mimeType, params.originalName);

      // Génération d'un nom de fichier unique
      const fileName = this.generateFileName(params.originalName);
      
      // Déterminer le dossier basé sur le type de fichier
      const folder = params.folder || this.getFolderByMimeType(params.mimeType);

      // Upload vers S3
      const uploadResult = await this.fileRepository.uploadFile({
        file: params.file,
        fileName,
        mimeType: params.mimeType,
        folder,
      });

      // Création de l'entité Media
      const mediaId = uuidv4();
      const media = Media.fromUpload(
        mediaId,
        params.originalName,
        fileName,
        params.mimeType,
        uploadResult.size,
        uploadResult.url,
        params.uploadedBy,
        params.alt
      );

      // Sauvegarde en base de données
      await this.mediaRepository.save(media);

      this.logger.log(`Media uploaded successfully: ${mediaId} - ${params.originalName}`);

      return {
        media,
        success: true,
        message: 'Media uploaded successfully'
      };

    } catch (error) {
      this.logger.error(`Failed to upload media: ${params.originalName}`, error);
      throw error;
    }
  }

  async getMediaById(id: string): Promise<Media> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Media with id ${id} not found`);
    }
    return media;
  }

  async getMediasByProject(projectId: string): Promise<Media[]> {
    return this.mediaRepository.findByProjectId(projectId);
  }

  async getAllMedia(): Promise<Media[]> {
    return this.mediaRepository.findAll();
  }

  async deleteMedia(id: string): Promise<void> {
    const media = await this.getMediaById(id);
    
    try {
      // Suppression du fichier S3
      await this.fileRepository.deleteFileByUrl(media.url);
      
      // Suppression de la base de données
      await this.mediaRepository.delete(id);
      
      this.logger.log(`Media deleted successfully: ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete media: ${id}`, error);
      throw error;
    }
  }

  async generateSignedUrl(id: string, expiresInSeconds: number = 3600): Promise<string> {
    const media = await this.getMediaById(id);
    
    // Extraire le nom du fichier et le dossier depuis l'URL
    const urlParts = media.url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts.length > 4 ? urlParts[urlParts.length - 2] : undefined;
    
    return this.fileRepository.generateSignedUrl(fileName, folder, expiresInSeconds);
  }

  async updateMediaMetadata(id: string, updateData: { alt?: string }): Promise<Media> {
    const media = await this.getMediaById(id);
    
    // Créer une nouvelle instance avec les données mises à jour
    const updatedMedia = new Media(
      media.id,
      media.type,
      media.url,
      media.originalName,
      media.fileName,
      media.mimeType,
      media.size,
      media.uploadedAt,
      updateData.alt ?? media.alt,
      media.uploadedBy
    );

    await this.mediaRepository.save(updatedMedia);
    return updatedMedia;
  }

  // Méthodes de validation et utilitaires privées
  private validateFile(file: Buffer, mimeType: string, originalName: string): void {
    // Validation de la taille
    if (file.length > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    // Validation du type MIME
    const allowedTypes = [
      ...this.ALLOWED_IMAGE_TYPES,
      ...this.ALLOWED_VIDEO_TYPES,
      ...this.ALLOWED_DOCUMENT_TYPES
    ];

    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException(
        `File type ${mimeType} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      );
    }

    // Validation de l'extension
    const extension = this.getFileExtension(originalName);
    if (!this.isValidExtension(extension, mimeType)) {
      throw new BadRequestException(
        `File extension ${extension} does not match MIME type ${mimeType}`
      );
    }
  }

  private generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const extension = this.getFileExtension(originalName);
    return `${timestamp}-${random}${extension}`;
  }

  private getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
  }

  private getFolderByMimeType(mimeType: string): string {
    if (this.ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return 'images';
    }
    if (this.ALLOWED_VIDEO_TYPES.includes(mimeType)) {
      return 'videos';
    }
    if (this.ALLOWED_DOCUMENT_TYPES.includes(mimeType)) {
      return 'documents';
    }
    return 'others';
  }

  private isValidExtension(extension: string, mimeType: string): boolean {
    const extensionMimeMap: Record<string, string[]> = {
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.png': ['image/png'],
      '.gif': ['image/gif'],
      '.webp': ['image/webp'],
      '.mp4': ['video/mp4'],
      '.mov': ['video/quicktime'],
      '.mpeg': ['video/mpeg'],
      '.webm': ['video/webm'],
      '.pdf': ['application/pdf'],
      '.doc': ['application/msword'],
      '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      '.txt': ['text/plain'],
    };

    const allowedMimeTypes = extensionMimeMap[extension.toLowerCase()];
    return allowedMimeTypes ? allowedMimeTypes.includes(mimeType) : false;
  }

  // Méthodes statistiques utiles
  async getMediaStats(): Promise<{
    totalCount: number;
    totalSize: number;
    byType: Record<string, number>;
  }> {
    const allMedia = await this.mediaRepository.findAll();
    
    const stats = {
      totalCount: allMedia.length,
      totalSize: allMedia.reduce((sum: number, media: Media) => sum + media.size, 0),
      byType: {} as Record<string, number>
    };

    allMedia.forEach((media: Media) => {
      stats.byType[media.type] = (stats.byType[media.type] || 0) + 1;
    });

    return stats;
  }
}