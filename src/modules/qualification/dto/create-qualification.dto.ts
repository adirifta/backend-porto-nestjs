import {
  IsString,
  IsEnum,
  IsDate,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { QualificationType } from '../entities/qualification.entity';

export class CreateQualificationDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  institution: string;

  @ApiProperty({ enum: QualificationType })
  @IsEnum(QualificationType)
  type: QualificationType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
