import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AboutService } from '../services/about.service';
import { About } from '../entities/about.entity';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  async getAbout(): Promise<About> {
    return this.aboutService.getActiveAbout();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateAbout(
    @Param('id') id: number,
    @Body() updateData: Partial<About>,
  ): Promise<About> {
    return this.aboutService.updateAbout(id, updateData);
  }
}
