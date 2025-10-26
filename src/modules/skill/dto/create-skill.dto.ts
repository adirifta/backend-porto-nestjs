import {
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['programming', 'framework', 'tool', 'soft'] })
  @IsEnum(['programming', 'framework', 'tool', 'soft'])
  category: string;

  @ApiProperty({ minimum: 0, maximum: 100, default: 0 })
  @IsInt()
  @Min(0)
  @Max(100)
  proficiency: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
