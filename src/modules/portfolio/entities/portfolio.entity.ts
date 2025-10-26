import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';

@Entity('portfolios')
export class Portfolio extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  projectUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ type: 'json' })
  technologies: string[];

  @Column({ type: 'enum', enum: ['web', 'mobile', 'desktop'], default: 'web' })
  category: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
