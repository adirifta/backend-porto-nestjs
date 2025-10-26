import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import {
  Qualification,
  QualificationType,
} from '../entities/qualification.entity';
import { CreateQualificationDto } from '../dto/create-qualification.dto';
import { UpdateQualificationDto } from '../dto/update-qualification.dto';

export interface IQualificationService {
  findAll(): Promise<Qualification[]>;
  findByType(type: QualificationType): Promise<Qualification[]>;
  findEducation(): Promise<Qualification[]>;
  findExperience(): Promise<Qualification[]>;
  findById(id: number): Promise<Qualification>;
  create(createDto: CreateQualificationDto): Promise<Qualification>;
  update(id: number, updateDto: UpdateQualificationDto): Promise<Qualification>;
  delete(id: number): Promise<void>;
}

@Injectable()
export class QualificationService implements IQualificationService {
  constructor(
    @Inject('QUALIFICATION_REPOSITORY')
    private readonly qualificationRepository: IGenericRepository<Qualification>,
  ) {}

  async findAll(): Promise<Qualification[]> {
    return this.qualificationRepository.findAll();
  }

  async findByType(type: QualificationType): Promise<Qualification[]> {
    const repo = this.qualificationRepository as any;
    return repo.findByType
      ? repo.findByType(type)
      : this.qualificationRepository.findByCriteria({ type });
  }

  async findEducation(): Promise<Qualification[]> {
    const repo = this.qualificationRepository as any;
    return repo.findEducation
      ? repo.findEducation()
      : this.findByType(QualificationType.EDUCATION);
  }

  async findExperience(): Promise<Qualification[]> {
    const repo = this.qualificationRepository as any;
    return repo.findExperience
      ? repo.findExperience()
      : this.findByType(QualificationType.EXPERIENCE);
  }

  async findById(id: number): Promise<Qualification> {
    const qualification = await this.qualificationRepository.findById(id);
    if (!qualification) {
      throw new NotFoundException(`Qualification with ID ${id} not found`);
    }
    return qualification;
  }

  async create(createDto: CreateQualificationDto): Promise<Qualification> {
    if (createDto.endDate && createDto.isCurrent) {
      throw new BadRequestException(
        'Cannot have both endDate and isCurrent true',
      );
    }

    if (!createDto.endDate && !createDto.isCurrent) {
      throw new BadRequestException(
        'Must specify either endDate or set isCurrent to true',
      );
    }

    return this.qualificationRepository.create(createDto);
  }

  async update(
    id: number,
    updateDto: UpdateQualificationDto,
  ): Promise<Qualification> {
    await this.findById(id);

    if (updateDto.endDate && updateDto.isCurrent) {
      throw new BadRequestException(
        'Cannot have both endDate and isCurrent true',
      );
    }

    return this.qualificationRepository.update(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.qualificationRepository.delete(id);
  }
}
