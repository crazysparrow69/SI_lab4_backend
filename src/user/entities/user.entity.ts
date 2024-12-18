import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserLevel } from './user-level.entity';
import { Background } from 'src/image/entities/background.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar_url?: string;

  @Column({ nullable: true })
  avatar_public_id?: string;

  @ManyToOne(() => Background, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'background_id' })
  background_id?: Background;

  @ManyToOne(() => UserRole, (role) => role.user_role_id, { nullable: true })
  @JoinColumn({ name: 'user_role_id' })
  user_role_id?: UserRole;

  @ManyToOne(() => UserLevel, (level) => level.user_level_id, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_level_id' })
  user_level_id?: UserLevel;
}
