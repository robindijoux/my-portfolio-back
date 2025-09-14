import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from 'src/application/project/project.service';
import { CreateProjectDTO, TechnoDTO, AddMediaToProjectDTO } from './project.dto';

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
  @ApiOperation({ 
    summary: 'Create a new project with media IDs',
    description: 'Create a project using IDs of previously uploaded media files. Upload media files first using POST /media/upload, then use their IDs here.'
  })
  @ApiBody({
    description: 'Project data with media IDs',
    type: CreateProjectDTO,
  })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data or media not found' })
  async createProject(@Body() projectData: CreateProjectDTO) {
    return this.projectService.createWithMediaIds(projectData);
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
    summary: 'Associate existing media with a project',
    description: 'Associate a previously uploaded media file with the specified project using its ID. Upload media first using POST /media/upload.'
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
  async addMediaToProject(
    @Param('id') projectId: string,
    @Body() addMediaDto: AddMediaToProjectDTO,
  ) {
    return this.projectService.addMediaById(projectId, addMediaDto.mediaId);
  }

  @Delete(':id/media/:mediaId')
  @ApiOperation({ summary: 'Remove media from a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Media removed successfully' })
  @ApiResponse({ status: 404, description: 'Project or media not found' })
  async removeMedia(@Param('id') id: string, @Param('mediaId') mediaId: string) {
    return this.projectService.removeMedia(id, mediaId);
  }

  @Post(':id/techno')
  @ApiOperation({ summary: 'Add technology to a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 201, description: 'Technology added successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async addTechnology(@Param('id') id: string, @Body() techno: TechnoDTO) {
    return this.projectService.addTechnology(id, techno);
  }

  @Delete(':id/techno/:technoId')
  @ApiOperation({ summary: 'Remove technology from a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiParam({ name: 'technoId', description: 'Technology ID to remove' })
  @ApiResponse({ status: 200, description: 'Technology removed successfully' })
  @ApiResponse({ status: 404, description: 'Project or technology not found' })
  async removeTechnology(@Param('id') id: string, @Param('technoId') technoId: string) {
    return this.projectService.removeTechnology(id, technoId);
  }
}
