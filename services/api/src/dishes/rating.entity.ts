import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dish_id: string;

  @Column('int')
  rating: number;

  @CreateDateColumn()
  created_at: Date;
}
