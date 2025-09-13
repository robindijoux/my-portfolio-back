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

  @ApiProperty({ description: 'Media type', enum: ['PHOTO', 'VIDEO'] })
  type: 'PHOTO' | 'VIDEO';

  @ApiProperty({ description: 'Media URL' })
  url: string;

  @ApiProperty({ description: 'Alternative text for the media', required: false })
  alt?: string;
}

export class MediaUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload (JPG, JPEG, PNG, GIF, WEBP)',
  })
  file: any;

  @ApiProperty({
    description: 'Alternative text for the image',
    required: false,
  })
  alt?: string;

  @ApiProperty({
    enum: ['PHOTO', 'VIDEO'],
    description: 'Media type',
    default: 'PHOTO',
    required: false,
  })
  type?: 'PHOTO' | 'VIDEO';
}

export type MediaUploadDTO = {
  file: any; // Uploaded file
  metadata?: {
    alt?: string;
    type?: 'PHOTO' | 'VIDEO';
  };
};

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
    description: 'Media associated with the project',
    type: [Object],
    default: [],
  })
  media: MediaDTO[];

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
    media: MediaDTO[] = [],
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

export class ProjectDTO extends CreateProjectDTO {
  @ApiProperty({ description: 'Unique project identifier' })
  id: string;

  @ApiProperty({ description: 'Number of project views' })
  views: number;

  @ApiProperty({ description: 'Project creation date' })
  createdAt: Date;

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
    super(
      name,
      description,
      isPublished,
      shortDescription,
      featured,
      repositoryLink,
      projectLink,
      media,
      techStack,
    );
    this.id = id;
    this.views = views;
    this.createdAt = createdAt;
  }
}
