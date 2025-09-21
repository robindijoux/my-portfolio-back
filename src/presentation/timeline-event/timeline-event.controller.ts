import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TimelineEventService } from 'src/application/timeline-event/timeline-event.service';
import { 
  CreateTimelineEventDTO, 
  UpdateTimelineEventDTO,
  TimelineEventDTO 
} from './timeline-event.dto';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infra/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../infra/auth/models/authenticated-user.model';

@ApiTags('timeline-events')
@Controller('timelineEvent')
export class TimelineEventController {
  constructor(private timelineEventService: TimelineEventService) {}

  @Get()
  @ApiOperation({ summary: 'Get all timeline events' })
  @ApiQuery({ 
    name: 'type', 
    required: false, 
    enum: ['education', 'achievement', 'work'],
    description: 'Filter by timeline event type'
  })
  @ApiResponse({
    status: 200,
    description: 'List of timeline events retrieved successfully',
    type: [TimelineEventDTO],
  })
  async getAllTimelineEvents(@Query('type') type?: string) {
    Logger.log('Fetching timeline events', type ? `with type filter: ${type}` : '');
    
    if (type) {
      return this.timelineEventService.findByType(type);
    }
    
    return this.timelineEventService.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new timeline event',
    description: 'Create a new timeline event. Requires authentication.'
  })
  @ApiBody({
    description: 'Timeline event data',
    type: CreateTimelineEventDTO,
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Timeline event created successfully',
    type: TimelineEventDTO,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async createTimelineEvent(
    @Body() createDto: CreateTimelineEventDTO, 
    @CurrentUser() user: AuthenticatedUser
  ) {
    Logger.log('Creating new timeline event', `for user: ${user.sub}`);
    return this.timelineEventService.create(createDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a timeline event by ID' })
  @ApiParam({ name: 'id', description: 'Timeline event ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Timeline event retrieved successfully',
    type: TimelineEventDTO,
  })
  @ApiResponse({ status: 404, description: 'Timeline event not found' })
  async getTimelineEventById(@Param('id') id: string) {
    Logger.log('Fetching timeline event by ID', id);
    return this.timelineEventService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update a timeline event',
    description: 'Update an existing timeline event. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Timeline event ID to update' })
  @ApiBody({
    description: 'Updated timeline event data',
    type: UpdateTimelineEventDTO,
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Timeline event updated successfully',
    type: TimelineEventDTO,
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided' })
  @ApiResponse({ status: 404, description: 'Timeline event not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async updateTimelineEvent(
    @Param('id') id: string,
    @Body() updateDto: UpdateTimelineEventDTO,
    @CurrentUser() user: AuthenticatedUser
  ) {
    Logger.log('Updating timeline event', `ID: ${id}, user: ${user.sub}`);
    return this.timelineEventService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete a timeline event',
    description: 'Delete an existing timeline event. Requires authentication.'
  })
  @ApiParam({ name: 'id', description: 'Timeline event ID to delete' })
  @ApiResponse({ status: 200, description: 'Timeline event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Timeline event not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async deleteTimelineEvent(
    @Param('id') id: string, 
    @CurrentUser() user: AuthenticatedUser
  ) {
    Logger.log('Deleting timeline event', `ID: ${id}, user: ${user.sub}`);
    return this.timelineEventService.delete(id);
  }
}