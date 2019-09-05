import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' })
  productId: number;

  @Column({ length: 25 })
  name: string;

  @CreateDateColumn()
  createAt: string;

  @Column()
  userId: number;

  @ManyToOne(type => User, { lazy: true })
  user: Promise<User>;

  @Column({ type: 'text' })
  description: string;
}
