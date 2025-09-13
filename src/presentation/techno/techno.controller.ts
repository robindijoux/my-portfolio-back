import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TechnoService } from 'src/application/techno/techno.service';
import { CreateTechnoDTO } from '../project/project.dto';

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
  @ApiOperation({ summary: 'Create a new technology' })
  @ApiResponse({ status: 201, description: 'Technology created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async createTechnology(@Body() data: CreateTechnoDTO) {
    return this.technoService.create(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a technology' })
  @ApiParam({ name: 'id', description: 'Technology ID to delete' })
  @ApiResponse({ status: 200, description: 'Technology deleted successfully' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  async deleteTechnology(@Param('id') id: string) {
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
