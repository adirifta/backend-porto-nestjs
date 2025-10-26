import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';

export enum QualificationType {
  EDUCATION = 'education',
  EXPERIENCE = 'experience',
}

@Entity('qualifications')
export class Qualification extends BaseEntity {
  @Column()
  title: string;

  @Column()
  institution: string;

  @Column({ type: 'enum', enum: QualificationType })
  type: QualificationType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
