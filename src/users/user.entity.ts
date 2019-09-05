import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  userId: number;

  @Column({ length: 25, nullable: false, unique: true })
  username: string;

  @Column({ length: 30, nullable: false })
  password: string;
}
