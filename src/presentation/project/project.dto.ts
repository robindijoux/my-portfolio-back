import { ApiProperty } from '@nestjs/swagger';

export class TechnoDTO {
  @ApiProperty({ description: 'Unique technology identifier' })
  id: string;

  @ApiProperty({ description: 'Technology name' })
  technology: string;

  @ApiProperty({ description: 'Technology icon URL' })
  iconUrl: string;
}

export class CreateTechnoDTO {
  @ApiProperty({ description: 'Technology name' })
  technology: string;

  @ApiProperty({ description: 'Technology icon URL' })
  iconUrl: string;
}

export class SimpleTechnoDTO {
  @ApiProperty({ description: 'Technology name' })
  technology: string;

  @ApiProperty({ description: 'Technology icon URL' })
  iconUrl: string;
}

export class MediaDTO {
  @ApiProperty({ description: 'Unique media identifier' })
  id: string;

  @ApiProperty({ description: 'Media type', enum: ['PHOTO', 'VIDEO', 'PDF', 'DOCUMENT'] })
  type: 'PHOTO' | 'VIDEO' | 'PDF' | 'DOCUMENT';

  @ApiProperty({ description: 'Media URL' })
  url: string;

  @ApiProperty({ description: 'Alternative text for the media', required: false })
  alt?: string;

  @ApiProperty({ description: 'Original file name' })
  originalName: string;

  @ApiProperty({ description: 'Generated file name on server' })
  fileName: string;

  @ApiProperty({ description: 'MIME type of the file' })
  mimeType: string;

  @ApiProperty({ description: 'File size in bytes' })
  size: number;

  @ApiProperty({ description: 'Upload timestamp' })
  uploadedAt: string;

  @ApiProperty({ description: 'User who uploaded the file', required: false })
  uploadedBy?: string;
}

export class MediaUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload (Images: JPG, JPEG, PNG, GIF, WEBP; Videos: MP4, MOV, MPEG, WEBM; Documents: PDF, DOC, DOCX, TXT)',
  })
  file: any;

  @ApiProperty({
    description: 'Alternative text for the media',
    required: false,
  })
  alt?: string;

  @ApiProperty({
    description: 'Folder to organize files (optional, will be auto-determined if not provided)',
    required: false,
  })
  folder?: string;
}

export type MediaUploadDTO = {
  file: any; // Uploaded file
  metadata?: {
    alt?: string;
    type?: 'PHOTO' | 'VIDEO';
  };
};

export class AddMediaToProjectDTO {
  @ApiProperty({ 
    description: 'ID of previously uploaded media to associate with the project',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  mediaId: string;
}

export class CreateProjectDTO {
  @ApiProperty({ description: 'Project name' })
  name: string;

  @ApiProperty({ description: 'Detailed project description' })
  description: string;

  @ApiProperty({ description: 'Indicates if the project is published' })
  isPublished: boolean;

  @ApiProperty({ description: 'Short project description' })
  shortDescription: string;

  @ApiProperty({ description: 'Repository link', required: false })
  repositoryLink?: string;

  @ApiProperty({ description: 'Online project link', required: false })
  projectLink?: string;

  @ApiProperty({
    description: 'Array of previously uploaded media IDs. Upload media first using POST /media/upload, then reference them here by ID.',
    type: [String],
    default: [],
    example: [
      "123e4567-e89b-12d3-a456-426614174000",
      "456e7890-e89b-12d3-a456-426614174001"
    ]
  })
  media: string[];

  @ApiProperty({ description: 'Indicates if the project is featured' })
  featured: boolean;

  @ApiProperty({
    description: 'Technologies used in the project (will be created if they don\'t exist)',
    type: [SimpleTechnoDTO],
    default: [],
  })
  techStack?: SimpleTechnoDTO[];

  constructor(
    name: string,
    description: string,
    isPublished: boolean,
    shortDescription: string,
    featured: boolean,
    repositoryLink?: string,
    projectLink?: string,
    media: string[] = [],
    techStack: TechnoDTO[] = [],
  ) {
    this.name = name;
    this.description = description;
    this.isPublished = isPublished;
    this.shortDescription = shortDescription;
    this.repositoryLink = repositoryLink;
    this.projectLink = projectLink;
    this.media = media;
    this.featured = featured;
    this.techStack = techStack;
  }
}

export class ProjectDTO {
  @ApiProperty({ description: 'Unique project identifier' })
  id: string;

  @ApiProperty({ description: 'Project name' })
  name: string;

  @ApiProperty({ description: 'Detailed project description' })
  description: string;

  @ApiProperty({ description: 'Indicates if the project is published' })
  isPublished: boolean;

  @ApiProperty({ description: 'Number of project views' })
  views: number;

  @ApiProperty({ description: 'Short project description' })
  shortDescription: string;

  @ApiProperty({ description: 'Project creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Repository link', required: false })
  repositoryLink?: string;

  @ApiProperty({ description: 'Online project link', required: false })
  projectLink?: string;

  @ApiProperty({
    description: 'Array of media objects associated with the project',
    type: [MediaDTO],
    default: [],
  })
  media: MediaDTO[];

  @ApiProperty({ description: 'Indicates if the project is featured' })
  featured: boolean;

  @ApiProperty({
    description: 'Technologies used in the project',
    type: [TechnoDTO],
    default: [],
  })
  techStack: TechnoDTO[];

  constructor(
    id: string,
    name: string,
    description: string,
    isPublished: boolean,
    views: number,
    shortDescription: string,
    createdAt: Date,
    featured: boolean,
    repositoryLink?: string,
    projectLink?: string,
    media: MediaDTO[] = [],
    techStack: TechnoDTO[] = [],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isPublished = isPublished;
    this.views = views;
    this.shortDescription = shortDescription;
    this.createdAt = createdAt;
    this.featured = featured;
    this.repositoryLink = repositoryLink;
    this.projectLink = projectLink;
    this.media = media;
    this.techStack = techStack;
  }
}
