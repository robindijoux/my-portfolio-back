import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpStatus,
  ParseUUIDPipe,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MediaService } from '../../application/media/media.service';
import { MediaDTO, MediaUploadDto } from '../project/project.dto';
import * as mediaMapper from '../../application/media/media.mapper';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infra/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../infra/auth/models/authenticated-user.model';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a media file - Requires authentication' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Media file upload',
    type: MediaUploadDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Media uploaded successfully',
    type: MediaDTO,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid file or file too large',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: MediaUploadDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MediaDTO> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const result = await this.mediaService.uploadMedia({
      file: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      alt: uploadDto.alt,
      folder: uploadDto.folder,
    });

    return mediaMapper.toDTO(result.media);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media by ID' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media found',
    type: MediaDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Media not found',
  })
  async getMediaById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MediaDTO> {
    const media = await this.mediaService.getMediaById(id);
    return mediaMapper.toDTO(media);
  }

  @Get()
  @ApiOperation({ summary: 'Get all media or filter by project' })
  @ApiQuery({ 
    name: 'projectId', 
    required: false, 
    description: 'Filter media by project ID' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media list retrieved',
    type: [MediaDTO],
  })
  async getMedia(
    @Query('projectId') projectId?: string,
  ): Promise<MediaDTO[]> {
    let mediaList;
    
    if (projectId) {
      mediaList = await this.mediaService.getMediasByProject(projectId);
    } else {
      mediaList = await this.mediaService.getAllMedia();
    }

    return mediaList.map((media: any) => mediaMapper.toDTO(media));
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete media by ID - Requires authentication' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Media deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Media not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async deleteMedia(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthenticatedUser): Promise<void> {
    await this.mediaService.deleteMedia(id);
  }

  @Put(':id/metadata')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update media metadata - Requires authentication' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiBody({
    description: 'Media metadata update',
    schema: {
      type: 'object',
      properties: {
        alt: { type: 'string', description: 'Alternative text' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media metadata updated',
    type: MediaDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Media not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async updateMediaMetadata(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateData: { alt?: string },
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<MediaDTO> {
    const updatedMedia = await this.mediaService.updateMediaMetadata(id, updateData);
    return mediaMapper.toDTO(updatedMedia);
  }

  @Get(':id/signed-url')
  @ApiOperation({ summary: 'Generate signed URL for private media access' })
  @ApiParam({ name: 'id', description: 'Media ID' })
  @ApiQuery({ 
    name: 'expiresIn', 
    required: false, 
    description: 'URL expiration time in seconds (default: 3600)' 
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signed URL generated',
    schema: {
      type: 'object',
      properties: {
        signedUrl: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Media not found',
  })
  async getSignedUrl(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('expiresIn') expiresIn?: number,
  ): Promise<{ signedUrl: string; expiresAt: Date }> {
    const expirationSeconds = expiresIn || 3600;
    const signedUrl = await this.mediaService.generateSignedUrl(id, expirationSeconds);
    
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expirationSeconds);

    return {
      signedUrl,
      expiresAt,
    };
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get media statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Media statistics',
    schema: {
      type: 'object',
      properties: {
        totalCount: { type: 'number' },
        totalSize: { type: 'number' },
        totalSizeFormatted: { type: 'string' },
        byType: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
      },
    },
  })
  async getMediaStats(): Promise<{
    totalCount: number;
    totalSize: number;
    totalSizeFormatted: string;
    byType: Record<string, number>;
  }> {
    const stats = await this.mediaService.getMediaStats();
    
    // Format file size for better readability
    const formatFileSize = (bytes: number): string => {
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = bytes;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    return {
      ...stats,
      totalSizeFormatted: formatFileSize(stats.totalSize),
    };
  }
}