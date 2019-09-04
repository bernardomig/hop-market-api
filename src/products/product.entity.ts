import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' })
  productId: number;

  @Column({ length: 25 })
  name: string;

  @Column()
  userId: number;

  @ManyToOne(type => User)
  @JoinTable()
  user: Promise<User>;
}
