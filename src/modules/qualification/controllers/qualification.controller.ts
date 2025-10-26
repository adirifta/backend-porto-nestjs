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
import { QualificationService } from '../services/qualification.service';
import { CreateQualificationDto } from '../dto/create-qualification.dto';
import { UpdateQualificationDto } from '../dto/update-qualification.dto';
import {
  Qualification,
  QualificationType,
} from '../entities/qualification.entity';

@ApiTags('Qualifications')
@Controller('qualifications')
export class QualificationController {
  constructor(private readonly qualificationService: QualificationService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all qualifications' })
  @ApiResponse({ status: 200, type: [Qualification] })
  async findAll(): Promise<Qualification[]> {
    return this.qualificationService.findAll();
  }

  @Get('education')
  @Public()
  @ApiOperation({ summary: 'Get education qualifications only' })
  async findEducation(): Promise<Qualification[]> {
    return this.qualificationService.findEducation();
  }

  @Get('experience')
  @Public()
  @ApiOperation({ summary: 'Get experience qualifications only' })
  async findExperience(): Promise<Qualification[]> {
    return this.qualificationService.findExperience();
  }

  @Get('type/:type')
  @Public()
  @ApiOperation({ summary: 'Get qualifications by type' })
  async findByType(
    @Param('type') type: QualificationType,
  ): Promise<Qualification[]> {
    return this.qualificationService.findByType(type);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get qualification by ID' })
  @ApiResponse({ status: 200, type: Qualification })
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Qualification> {
    return this.qualificationService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create qualification (Admin only)' })
  async create(
    @Body() createDto: CreateQualificationDto,
  ): Promise<Qualification> {
    return this.qualificationService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update qualification (Admin only)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateQualificationDto,
  ): Promise<Qualification> {
    return this.qualificationService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete qualification (Admin only)' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.qualificationService.delete(id);
  }
}
