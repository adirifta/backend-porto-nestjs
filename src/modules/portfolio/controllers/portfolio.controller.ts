import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Public } from '../../../common/decorators/public.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { PortfolioService } from '../services/portfolio.service';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { Portfolio } from '../entities/portfolio.entity';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all published portfolio items' })
  @ApiResponse({ status: 200, type: [Portfolio] })
  async findAll(): Promise<Portfolio[]> {
    return this.portfolioService.findAll();
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all portfolio items (Admin only)' })
  async findAllAdmin(): Promise<Portfolio[]> {
    return this.portfolioService.findAllAdmin();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get portfolio item by ID' })
  @ApiResponse({ status: 200, type: Portfolio })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Portfolio> {
    return this.portfolioService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create portfolio item (Admin only)' })
  async create(@Body() createDto: CreatePortfolioDto): Promise<Portfolio> {
    return this.portfolioService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update portfolio item (Admin only)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    return this.portfolioService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete portfolio item (Admin only)' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.portfolioService.delete(id);
  }

  @Put(':id/toggle-publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Toggle portfolio item publish status (Admin only)',
  })
  async togglePublish(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Portfolio> {
    return this.portfolioService.togglePublish(id);
  }
}
