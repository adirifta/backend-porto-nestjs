import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import { Portfolio } from '../entities/portfolio.entity';

@Injectable()
export class PortfolioRepository implements IGenericRepository<Portfolio> {
  constructor(
    @InjectRepository(Portfolio)
    private readonly repository: Repository<Portfolio>,
  ) {}

  async findAll(): Promise<Portfolio[]> {
    return this.repository.find({
      where: { isPublished: true },
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Portfolio | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(data: DeepPartial<Portfolio>): Promise<Portfolio> {
    const portfolio = this.repository.create(data);
    return this.repository.save(portfolio);
  }

  async update(id: number, data: DeepPartial<Portfolio>): Promise<Portfolio> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Portfolio with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCriteria(criteria: Partial<Portfolio>): Promise<Portfolio[]> {
    return this.repository.find({ where: criteria as any });
  }

  async findAllAdmin(): Promise<Portfolio[]> {
    return this.repository.find({
      order: { sortOrder: 'ASC', createdAt: 'DESC' },
    });
  }
}
