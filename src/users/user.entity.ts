import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  userId: number;

  @Column({ length: 25, nullable: false, unique: true })
  username: string;

  @Column({ length: 30, nullable: false })
  password: string;
}
