import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from 'src/application/project/project.service';
import { CreateProjectDTO, type MediaDTO } from './project.dto';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'List of all projects retrieved successfully',
  })
  async getAllProjects() {
    Logger.log('Fetching all projects');
    return this.projectService.list();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async createProject(@Body() data: CreateProjectDTO) {
    return this.projectService.create(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID to delete' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async deleteProject(@Param('id') id: string) {
    return this.projectService.delete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectById(@Param('id') id: string) {
    return this.projectService.get(id);
  }

  @Post(':id/media')
  @ApiOperation({
    summary: 'Add media (image) to a project',
    description:
      'Upload an image file and associate it with the specified project',
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload with optional metadata',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPG, JPEG, PNG, GIF, WEBP)',
        },
        alt: {
          type: 'string',
          description: 'Alternative text for the image',
        },
        type: {
          type: 'string',
          enum: ['PHOTO', 'VIDEO'],
          description: 'Media type',
          default: 'PHOTO',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Media added successfully to the project',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        media: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: { type: 'string', enum: ['PHOTO', 'VIDEO'] },
              url: { type: 'string' },
              alt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Missing file or unsupported file type',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 413, description: 'File too large (max 5MB)' })
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  async addMedia(
    @Param('id') id: string,
    @UploadedFile() file: UploadedFile,
    @Body() metadata?: { alt?: string; type?: 'PHOTO' | 'VIDEO' },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      // Generate unique filename to avoid conflicts
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${file.originalname}`;
      const filePath = join(uploadsDir, uniqueFilename);

      // Write file to disk
      await writeFile(filePath, file.buffer);

      const mediaDTO: MediaDTO = {
        id: crypto.randomUUID(), // Generate unique ID for the media
        type: metadata?.type || 'PHOTO',
        url: `/uploads/${uniqueFilename}`,
        alt: metadata?.alt,
      };

      return this.projectService.addMedia(id, mediaDTO);
    } catch (error) {
      Logger.error('Error saving file:', error);
      throw new BadRequestException('Failed to save file');
    }
  }

  @Delete(':id/media/:mediaId')
  @ApiOperation({ summary: 'Remove media from a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Media removed successfully' })
  @ApiResponse({ status: 404, description: 'Project or media not found' })
  async removeMedia(@Param('id') id: string, @Param('mediaId') mediaId: string) {
    return this.projectService.removeMedia(id, mediaId);
  }
}
