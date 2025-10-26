import { Injectable, Inject } from '@nestjs/common';
import type { IGenericRepository } from '../../../core/interfaces/generic-repository.interface';
import { About } from '../entities/about.entity';

export interface IAboutService {
  getActiveAbout(): Promise<About>;
  updateAbout(id: number, data: Partial<About>): Promise<About>;
}

@Injectable()
export class AboutService implements IAboutService {
  constructor(
    @Inject('ABOUT_REPOSITORY')
    private readonly aboutRepository: IGenericRepository<About>,
  ) {}

  async getActiveAbout(): Promise<About> {
    const abouts = await this.aboutRepository.findByCriteria({
      isActive: true,
    });
    return abouts[0] || null;
  }

  async updateAbout(id: number, data: Partial<About>): Promise<About> {
    return this.aboutRepository.update(id, data);
  }
}
