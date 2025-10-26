import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { IGenericRepository } from '../interfaces/generic-repository.interface';
import { BaseEntity } from '../entities/base.entity';

export abstract class BaseRepository<T extends BaseEntity>
  implements IGenericRepository<T>
{
  constructor(protected readonly repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Entity with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByCriteria(criteria: Partial<T>): Promise<T[]> {
    return this.repository.find({ where: criteria as any });
  }
}
