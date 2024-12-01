import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserLevel } from './user-level.entity';

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

  @ManyToOne(() => UserRole, (role) => role.user_role_id, { nullable: true })
  @JoinColumn({ name: 'user_role_id' })
  user_role_id?: UserRole;

  @ManyToOne(() => UserLevel, (level) => level.user_level_id, { nullable: true })
  @JoinColumn({ name: 'user_level_id' })
  user_level_id?: UserLevel;
}
