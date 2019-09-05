import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';


@Entity({ name: 'Transactions' })
export class Transactions {
  @PrimaryGeneratedColumn({ name: 'id' })
  productId?: number;

  @Column({ length: 25 })
  name: string;

  @CreateDateColumn()
  createdAt?: string;

  @Column('point')
  locatedIn: number;

  @Column()
  typeTransaction: string;

}
