import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ 
    summary: 'Health check endpoint',
    description: 'Checks the health status of the application and its dependencies'
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-09-13T10:30:00.000Z' },
        checks: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'healthy' },
            uptime: { type: 'number', example: 3600 }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 503,
    description: 'Service is unhealthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'error' },
        timestamp: { type: 'string', example: '2025-09-13T10:30:00.000Z' },
        checks: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'unhealthy' },
            uptime: { type: 'number', example: 3600 }
          }
        },
        error: { type: 'string', example: 'Database connection failed' }
      }
    }
  })
  async check() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();
    
    try {
      // Check database connection
      await this.checkDatabase();
      
      this.logger.log('Health check passed');
      
      return {
        status: 'ok',
        timestamp,
        checks: {
          database: 'healthy',
          uptime: Math.floor(uptime)
        }
      };
    } catch (error) {
      this.logger.error('Health check failed', error);
      
      return {
        status: 'error',
        timestamp,
        checks: {
          database: 'unhealthy',
          uptime: Math.floor(uptime)
        },
        error: error.message
      };
    }
  }

  private async checkDatabase(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      throw new Error('Database connection not initialized');
    }

    // Simple query to test database connectivity
    await this.dataSource.query('SELECT 1');
  }
}