import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import { Skill } from '../entities/skill.entity';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';

export interface ISkillService {
  findAll(): Promise<Skill[]>;
  findAllAdmin(): Promise<Skill[]>;
  findByCategory(category: string): Promise<Skill[]>;
  findById(id: number): Promise<Skill>;
  create(createDto: CreateSkillDto): Promise<Skill>;
  update(id: number, updateDto: UpdateSkillDto): Promise<Skill>;
  delete(id: number): Promise<void>;
  toggleActive(id: number): Promise<Skill>;
}

@Injectable()
export class SkillService implements ISkillService {
  constructor(
    @Inject('SKILL_REPOSITORY')
    private readonly skillRepository: IGenericRepository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    return this.skillRepository.findByCriteria({ isActive: true });
  }

  async findAllAdmin(): Promise<Skill[]> {
    const repo = this.skillRepository as any;
    return repo.findAllAdmin
      ? repo.findAllAdmin()
      : this.skillRepository.findAll();
  }

  async findByCategory(category: string): Promise<Skill[]> {
    const repo = this.skillRepository as any;
    return repo.findByCategory
      ? repo.findByCategory(category)
      : this.skillRepository.findByCriteria({ category, isActive: true });
  }

  async findById(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findById(id);
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async create(createDto: CreateSkillDto): Promise<Skill> {
    return this.skillRepository.create(createDto);
  }

  async update(id: number, updateDto: UpdateSkillDto): Promise<Skill> {
    await this.findById(id);
    return this.skillRepository.update(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.skillRepository.delete(id);
  }

  async toggleActive(id: number): Promise<Skill> {
    const skill = await this.findById(id);
    skill.isActive = !skill.isActive;
    return this.skillRepository.update(id, { isActive: skill.isActive });
  }
}
