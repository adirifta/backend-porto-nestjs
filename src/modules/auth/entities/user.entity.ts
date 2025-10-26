import { Entity, Column, BeforeInsert, BeforeUpdate, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../core/entities/base.entity';
import * as bcrypt from 'bcrypt';
import { UserProfile } from '../../user/entities/user-profile.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true }) // Tambahkan type dan nullable
  refreshToken: string | null; // Ubah tipe menjadi string | null

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @BeforeInsert()
  async hashPasswordOnInsert() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  @BeforeUpdate()
  async hashPasswordOnUpdate() {
    // Only hash if password is modified
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
  }
}