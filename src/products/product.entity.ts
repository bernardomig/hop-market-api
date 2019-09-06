import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'products_images' })
export class ProductPhoto {
  @PrimaryGeneratedColumn({ name: 'id' })
  photoId?: number;

  @Column()
  productId: number;

  @ManyToOne(type => Product, user => user.photos)
  @JoinColumn()
  product?: Promise<Product>;

  @Column('text')
  url: string;
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'id' })
  productId?: number;

  @Column({ length: 25 })
  name: string;

  @CreateDateColumn()
  createdAt?: string;

  @Column()
  userId: number;

  @ManyToOne(type => User, { lazy: true })
  user?: Promise<User>;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(type => ProductPhoto, photo => photo.product, { eager: true })
  @JoinColumn()
  photos?: ProductPhoto[];

  @ManyToMany(type => Product)
  @JoinTable()
  ingredients?: Promise<Product[]>;
}
