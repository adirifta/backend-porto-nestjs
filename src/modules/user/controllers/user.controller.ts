import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UserProfile } from '../entities/user-profile.entity';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Req() req): Promise<UserProfile> {
    return this.userService.getProfile(req.user.sub);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @Req() req,
    @Body() updateData: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.userService.updateProfile(req.user.sub, updateData);
  }
}
