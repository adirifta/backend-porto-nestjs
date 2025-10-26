import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import { Skill } from '../entities/skill.entity';

@Injectable()
export class SkillRepository implements IGenericRepository<Skill> {
  constructor(
    @InjectRepository(Skill)
    private readonly repository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findById(id: number): Promise<Skill | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: Partial<Skill>): Promise<Skill> {
    const skill = this.repository.create(data);
    return this.repository.save(skill);
  }

  async update(id: number, data: Partial<Skill>): Promise<Skill> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Skill with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCriteria(criteria: Partial<Skill>): Promise<Skill[]> {
    return this.repository.find({ where: criteria });
  }

  async findByCategory(category: string): Promise<Skill[]> {
    return this.repository.find({
      where: { category, isActive: true },
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }

  async findAllAdmin(): Promise<Skill[]> {
    return this.repository.find({
      order: { sortOrder: 'ASC', name: 'ASC' },
    });
  }
}
