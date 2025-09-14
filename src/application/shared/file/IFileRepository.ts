export interface UploadFileParams {
  file: Buffer;
  fileName: string;
  mimeType: string;
  folder?: string; // optionnel pour organiser les fichiers par dossier
}

export interface UploadFileResult {
  url: string;
  fileName: string;
  size: number;
}

export interface IFileRepository {
  readFile(filePath: string): Promise<string>;
  writeFile(filePath: string, content: string): Promise<void>;
  deleteFile(filePath: string): Promise<void>;
  
  // Nouvelles méthodes pour l'upload de médias
  uploadFile(params: UploadFileParams): Promise<UploadFileResult>;
  deleteFileByUrl(url: string): Promise<void>;
  getFileUrl(fileName: string, folder?: string): string;
  generateSignedUrl(fileName: string, folder?: string, expiresInSeconds?: number): Promise<string>;
}

export const IFILE_REPOSITORY = 'IFileRepository';