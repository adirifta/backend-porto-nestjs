import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
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
import { SkillService } from '../services/skill.service';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { Skill } from '../entities/skill.entity';

@ApiTags('Skills')
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active skills' })
  @ApiResponse({ status: 200, type: [Skill] })
  async findAll(): Promise<Skill[]> {
    return this.skillService.findAll();
  }

  @Get('category/:category')
  @Public()
  @ApiOperation({ summary: 'Get skills by category' })
  async findByCategory(@Param('category') category: string): Promise<Skill[]> {
    return this.skillService.findByCategory(category);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all skills (Admin only)' })
  async findAllAdmin(): Promise<Skill[]> {
    return this.skillService.findAllAdmin();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({ status: 200, type: Skill })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Skill> {
    return this.skillService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create skill (Admin only)' })
  async create(@Body() createDto: CreateSkillDto): Promise<Skill> {
    return this.skillService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update skill (Admin only)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSkillDto,
  ): Promise<Skill> {
    return this.skillService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete skill (Admin only)' })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.skillService.delete(id);
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle skill active status (Admin only)' })
  async toggleActive(@Param('id', ParseIntPipe) id: number): Promise<Skill> {
    return this.skillService.toggleActive(id);
  }
}
