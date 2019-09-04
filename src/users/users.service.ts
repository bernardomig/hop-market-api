import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[];

  constructor() {
    this.users = [
      { userId: 1, username: 'john', password: 'changeMe' },
      { userId: 2, username: 'maria', password: 'guess' },
      { userId: 3, username: 'chris', password: 'secret' },
    ];
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.userId === id);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
