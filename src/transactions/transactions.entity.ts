import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export enum TransactionType {
  Create,
  Craft,
  Transfer,
  Delete,
}

@Entity({ name: 'transactions' })
export class Transactions {
  @PrimaryGeneratedColumn({ name: 'id' })
  productId?: number;

  @Column({ length: 25 })
  name: string;

  @CreateDateColumn()
  createdAt?: string;

  @Column('point')
  locatedIn: number;

  @Column('enum', { enum: TransactionType })
  type: string;
  @Column()
  typeTransaction: string;
}
