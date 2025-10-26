import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/user-profile.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export interface IUserService {
  getProfile(userId: number): Promise<UserProfile>;
  updateProfile(
    userId: number,
    updateData: UpdateProfileDto,
  ): Promise<UserProfile>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
  ) {}

  async getProfile(userId: number): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateProfile(
    userId: number,
    updateData: UpdateProfileDto,
  ): Promise<UserProfile> {
    let profile = await this.userProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      profile = this.userProfileRepository.create({ ...updateData, userId });
    } else {
      this.userProfileRepository.merge(profile, updateData);
    }

    return await this.userProfileRepository.save(profile);
  }
}
