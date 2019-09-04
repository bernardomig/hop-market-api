import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ username });

    return user;
  }
}
