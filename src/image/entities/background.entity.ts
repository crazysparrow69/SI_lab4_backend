import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Background {
  @PrimaryGeneratedColumn()
  background_id: number;

  @Column({ type: 'mediumblob' })
  data: Buffer;

  @Column()
  user_id: number;
}
