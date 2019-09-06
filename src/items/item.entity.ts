import { User } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  itemId?: number;

  @Column()
  productId: number;

  @ManyToOne(type => Product)
  product?: Promise<Product>;

  @Column()
  userId: number;

  @ManyToOne(type => User, { lazy: true })
  user?: Promise<User>;

  @CreateDateColumn()
  createAt?: string;

  @Column()
  inCirculation?: boolean;

  @Column('point')
  location: string;
}
