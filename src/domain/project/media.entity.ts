export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  DOCUMENT = 'DOCUMENT',
}

export class Media {
  id: string;
  type: MediaType;
  url: string;
  alt?: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number; // en bytes
  uploadedAt: Date;
  uploadedBy?: string; // userId ou autre identifiant

  constructor(
    id: string, 
    type: MediaType, 
    url: string, 
    originalName: string,
    fileName: string,
    mimeType: string,
    size: number,
    uploadedAt: Date,
    alt?: string,
    uploadedBy?: string
  ) {
    if (!id || id.trim().length === 0) {
      throw new Error('Media id is required');
    }
    if (!url || url.trim().length === 0) {
      throw new Error('Media url is required');
    }
    if (!originalName || originalName.trim().length === 0) {
      throw new Error('Media original name is required');
    }
    if (!fileName || fileName.trim().length === 0) {
      throw new Error('Media file name is required');
    }
    if (!mimeType || mimeType.trim().length === 0) {
      throw new Error('Media mime type is required');
    }
    if (size <= 0) {
      throw new Error('Media size must be positive');
    }
    if (!uploadedAt) {
      throw new Error('Media upload date is required');
    }

    this.id = id;
    this.type = type;
    this.url = url;
    this.originalName = originalName;
    this.fileName = fileName;
    this.mimeType = mimeType;
    this.size = size;
    this.uploadedAt = uploadedAt;
    this.alt = alt;
    this.uploadedBy = uploadedBy;
    Object.freeze(this); // shallow immutability
  }

  static fromUpload(
    id: string,
    originalName: string,
    fileName: string,
    mimeType: string,
    size: number,
    s3Url: string,
    uploadedBy?: string,
    alt?: string
  ): Media {
    const type = Media.determineTypeFromMimeType(mimeType);
    return new Media(
      id,
      type,
      s3Url,
      originalName,
      fileName,
      mimeType,
      size,
      new Date(),
      alt,
      uploadedBy
    );
  }

  static determineTypeFromMimeType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) {
      return MediaType.PHOTO;
    }
    if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    }
    if (mimeType === 'application/pdf') {
      return MediaType.PDF;
    }
    return MediaType.DOCUMENT;
  }

  isImage(): boolean {
    return this.type === MediaType.PHOTO;
  }

  isVideo(): boolean {
    return this.type === MediaType.VIDEO;
  }

  isPdf(): boolean {
    return this.type === MediaType.PDF;
  }

  isDocument(): boolean {
    return this.type === MediaType.DOCUMENT;
  }

  getFormattedSize(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.size;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  equals(other: Media): boolean {
    if (!other) return false;
    return (
      this.id === other.id &&
      this.type === other.type &&
      this.url === other.url &&
      this.originalName === other.originalName &&
      this.fileName === other.fileName &&
      this.mimeType === other.mimeType &&
      this.size === other.size &&
      this.uploadedAt?.getTime() === other.uploadedAt?.getTime() &&
      this.alt === other.alt &&
      this.uploadedBy === other.uploadedBy
    );
  }
}
