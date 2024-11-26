import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  user_role_id: number;

  @Column()
  name: string;
}
