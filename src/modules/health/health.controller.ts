import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class HealthController {
  
  @Get()
  @ApiOperation({ summary: 'API Root - Health Check' })
  getRoot() {
    return {
      message: '🚀 Portfolio API is running!',
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        about: '/api/about',
        portfolio: '/api/portfolio',
        skills: '/api/skills',
        qualifications: '/api/qualifications',
        user: '/api/user'
      }
    };
  }

  @Get('api')
  @ApiOperation({ summary: 'API Base Route' })
  getApiBase() {
    return {
      message: 'Portfolio API is running!',
      timestamp: new Date().toISOString(),
      documentation: 'Add /health for detailed status'
    };
  }

  @Get('api/health')
  @ApiOperation({ summary: 'Detailed Health Check' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: process.memoryUsage(),
      nodeVersion: process.version
    };
  }
}