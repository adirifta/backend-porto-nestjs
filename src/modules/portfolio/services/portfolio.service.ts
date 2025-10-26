import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import { Portfolio } from '../entities/portfolio.entity';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';

export interface IPortfolioService {
  findAll(): Promise<Portfolio[]>;
  findAllAdmin(): Promise<Portfolio[]>;
  findById(id: number): Promise<Portfolio>;
  create(createDto: CreatePortfolioDto): Promise<Portfolio>;
  update(id: number, updateDto: UpdatePortfolioDto): Promise<Portfolio>;
  delete(id: number): Promise<void>;
  togglePublish(id: number): Promise<Portfolio>;
}

@Injectable()
export class PortfolioService implements IPortfolioService {
  constructor(
    @Inject('PORTFOLIO_REPOSITORY')
    private readonly portfolioRepository: IGenericRepository<Portfolio>,
  ) {}

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioRepository.findByCriteria({ isPublished: true });
  }

  async findAllAdmin(): Promise<Portfolio[]> {
    const repo = this.portfolioRepository as any;
    return repo.findAllAdmin
      ? repo.findAllAdmin()
      : this.portfolioRepository.findAll();
  }

  async findById(id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findById(id);
    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }
    return portfolio;
  }

  async create(createDto: CreatePortfolioDto): Promise<Portfolio> {
    return this.portfolioRepository.create(createDto);
  }

  async update(id: number, updateDto: UpdatePortfolioDto): Promise<Portfolio> {
    await this.findById(id);
    return this.portfolioRepository.update(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    return this.portfolioRepository.delete(id);
  }

  async togglePublish(id: number): Promise<Portfolio> {
    const portfolio = await this.findById(id);
    const updatedData = { isPublished: !portfolio.isPublished };
    return this.portfolioRepository.update(id, updatedData);
  }
}
