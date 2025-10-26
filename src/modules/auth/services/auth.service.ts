import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { LoginDto } from '../dto/login.dto';

export interface UserWithoutSensitiveInfo {
  id: number;
  email: string;
  role: string;
  refreshToken?: string;
  profile?: any;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-123';
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutSensitiveInfo | null> {
    try {
      this.logger.log(`Validating user: ${email}`);

      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['profile'],
      });

      if (!user) {
        this.logger.warn(`User not found: ${email}`);
        return null;
      }

      this.logger.log(`User found: ${user.email}, checking password...`);

      const isPasswordValid = await user.validatePassword(password);
      this.logger.log(`Password valid: ${isPasswordValid}`);

      if (isPasswordValid) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user;
        return result as UserWithoutSensitiveInfo;
      }

      return null;
    } catch (error) {
      this.logger.error(
        `Error validating user: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: UserWithoutSensitiveInfo;
  }> {
    this.logger.log(`Login attempt for: ${loginDto.email}`);

    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      this.logger.warn(`Login failed for: ${loginDto.email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.refreshSecret,
    });

    // Save refresh token to user
    await this.userRepository.update(user.id, { refreshToken });

    this.logger.log(`Login successful for: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.refreshSecret,
      });

      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.sub, refreshToken },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      this.logger.error(
        `Error refreshing token: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }
}