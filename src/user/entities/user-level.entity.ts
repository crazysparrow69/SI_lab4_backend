import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class UserLevel {
  @PrimaryGeneratedColumn()
  user_level_id: number;

  @Column()
  name: string;
}