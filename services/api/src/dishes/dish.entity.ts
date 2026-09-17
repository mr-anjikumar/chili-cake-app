import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  photo_url: string | null;

  @Column()
  place_name: string;

  @Column('double precision', { nullable: true })
  lat: number | null;

  @Column('double precision', { nullable: true })
  lng: number | null;

  @CreateDateColumn()
  created_at: Date;
}
