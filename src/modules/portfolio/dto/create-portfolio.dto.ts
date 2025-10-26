import {
  IsString,
  IsUrl,
  IsArray,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  projectUrl?: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  technologies: string[];

  @ApiProperty({ enum: ['web', 'mobile', 'desktop'] })
  @IsEnum(['web', 'mobile', 'desktop'])
  category: string;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
