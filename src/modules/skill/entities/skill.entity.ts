import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';

@Entity('skills')
export class Skill extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['programming', 'framework', 'tool', 'soft'],
    default: 'programming',
  })
  category: string;

  @Column({ type: 'int', default: 0 })
  proficiency: number; // 0-100

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
