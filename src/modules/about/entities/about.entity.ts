import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';

@Entity('about')
export class About extends BaseEntity {
  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  resumeUrl: string;

  @Column({ type: 'json', nullable: true })
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };

  @Column({ default: true })
  isActive: boolean;
}
