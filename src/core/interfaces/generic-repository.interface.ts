import { DeepPartial } from 'typeorm';

export interface IGenericRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: DeepPartial<T>): Promise<T>;
  update(id: number, data: DeepPartial<T>): Promise<T>;
  delete(id: number): Promise<void>;
  findByCriteria(criteria: Partial<T>): Promise<T[]>;
}
