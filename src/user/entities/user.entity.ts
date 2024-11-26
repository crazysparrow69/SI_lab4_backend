import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { UserRole } from './user-role.entity';

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

  @OneToOne(() => UserRole, (role) => role.user_role_id)
  user_role_id?: UserRole;

  @OneToOne(() => UserRole, (role) => role.user_role_id)
  user_level_id?: UserRole;
}
