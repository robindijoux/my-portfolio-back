import {
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
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TechnoService } from 'src/application/techno/techno.service';
import { CreateTechnoDTO } from '../project/project.dto';
import { JwtAuthGuard } from '../../infra/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infra/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../infra/auth/models/authenticated-user.model';

@ApiTags('technologies')
@Controller('technologies')
export class TechnoController {
  constructor(private technoService: TechnoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all technologies' })
  @ApiResponse({
    status: 200,
    description: 'List of all technologies retrieved successfully',
  })
  async getAllTechnologies() {
    Logger.log('Fetching all technologies');
    return this.technoService.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new technology - Requires authentication' })
  @ApiResponse({ status: 201, description: 'Technology created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async createTechnology(@Body() data: CreateTechnoDTO, @CurrentUser() user: AuthenticatedUser) {
    return this.technoService.create(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a technology - Requires authentication' })
  @ApiParam({ name: 'id', description: 'Technology ID to delete' })
  @ApiResponse({ status: 200, description: 'Technology deleted successfully' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing JWT token' })
  async deleteTechnology(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.technoService.delete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a technology by ID' })
  @ApiParam({ name: 'id', description: 'Technology ID' })
  @ApiResponse({ status: 200, description: 'Technology retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  async getTechnologyById(@Param('id') id: string) {
    return this.technoService.get(id);
  }
}
