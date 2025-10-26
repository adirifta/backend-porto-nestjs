import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import {
  Qualification,
  QualificationType,
} from '../entities/qualification.entity';

@Injectable()
export class QualificationRepository
  implements IGenericRepository<Qualification>
{
  constructor(
    @InjectRepository(Qualification)
    private readonly repository: Repository<Qualification>,
  ) {}

  async findAll(): Promise<Qualification[]> {
    return this.repository.find({
      order: { sortOrder: 'ASC', startDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<Qualification | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Qualification>): Promise<Qualification> {
    const qualification = this.repository.create(data);
    return this.repository.save(qualification);
  }

  async update(
    id: number,
    data: Partial<Qualification>,
  ): Promise<Qualification> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Qualification with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCriteria(
    criteria: Partial<Qualification>,
  ): Promise<Qualification[]> {
    return this.repository.find({ where: criteria });
  }

  async findByType(type: QualificationType): Promise<Qualification[]> {
    return this.repository.find({
      where: { type },
      order: { sortOrder: 'ASC', startDate: 'DESC' },
    });
  }

  async findEducation(): Promise<Qualification[]> {
    return this.findByType(QualificationType.EDUCATION);
  }

  async findExperience(): Promise<Qualification[]> {
    return this.findByType(QualificationType.EXPERIENCE);
  }
}
