import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import { About } from '../entities/about.entity';

@Injectable()
export class AboutRepository implements IGenericRepository<About> {
  constructor(
    @InjectRepository(About)
    private readonly repository: Repository<About>,
  ) {}

  async findAll(): Promise<About[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<About | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: DeepPartial<About>): Promise<About> {
    const about = this.repository.create(data);
    return this.repository.save(about);
  }

  async update(id: number, data: DeepPartial<About>): Promise<About> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`About with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCriteria(criteria: Partial<About>): Promise<About[]> {
    return this.repository.find({ where: criteria as any });
  }
}
