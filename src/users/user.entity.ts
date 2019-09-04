import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  userId: number;

  @Column({ length: 25 })
  username: string;

  @Column({ length: 30 })
  password: string;
}
