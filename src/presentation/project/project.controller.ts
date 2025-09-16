import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectService } from 'src/application/project/project.service';
import { CreateProjectDTO, TechnoDTO, AddMediaToProjectDTO } from './project.dto';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infra/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../infra/auth/models/authenticated-user.model';

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new project with media IDs',
    description: 'Create a project using IDs of previously uploaded media files. Upload media files first using POST /media/upload, then use their IDs here. Requires authentication.'
  })
  @ApiBody({
    description: 'Project data with media IDs',
    type: CreateProjectDTO,
  })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async createProject(@Body() projectData: CreateProjectDTO, @CurrentUser() user: AuthenticatedUser) {
    return this.projectService.createWithMediaIds(projectData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project - Requires authentication' })
  @ApiParam({ name: 'id', description: 'Project ID to delete' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async deleteProject(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Associate existing media with a project - Requires authentication',
    description: 'Associate a previously uploaded media file with the specified project using its ID. Upload media first using POST /media/upload. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiBody({
    description: 'Media ID to associate with the project',
    type: AddMediaToProjectDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Media associated successfully with the project',
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
              type: { type: 'string', enum: ['PHOTO', 'VIDEO', 'PDF', 'DOCUMENT'] },
              url: { type: 'string' },
              alt: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid media ID' })
  @ApiResponse({ status: 404, description: 'Project or media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async addMediaToProject(
    @Param('id') projectId: string,
    @Body() addMediaDto: AddMediaToProjectDTO,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.projectService.addMediaById(projectId, addMediaDto.mediaId);
  }

  @Delete(':id/media/:mediaId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove media from a project - Requires authentication' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Media removed successfully' })
  @ApiResponse({ status: 404, description: 'Project or media not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async removeMedia(@Param('id') id: string, @Param('mediaId') mediaId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectService.removeMedia(id, mediaId);
  }

  @Post(':id/techno')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add technology to a project - Requires authentication' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 201, description: 'Technology added successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async addTechnology(@Param('id') id: string, @Body() techno: TechnoDTO, @CurrentUser() user: AuthenticatedUser) {
    return this.projectService.addTechnology(id, techno);
  }

  @Delete(':id/techno/:technoId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove technology from a project - Requires authentication' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiParam({ name: 'technoId', description: 'Technology ID to remove' })
  @ApiResponse({ status: 200, description: 'Technology removed successfully' })
  @ApiResponse({ status: 404, description: 'Project or technology not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async removeTechnology(@Param('id') id: string, @Param('technoId') technoId: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectService.removeTechnology(id, technoId);
  }
}
