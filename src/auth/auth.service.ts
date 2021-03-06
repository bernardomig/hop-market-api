import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Login } from './login.interface';

import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { Token } from './token.interface';
import { UserDto } from 'src/users/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Login | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && user.password === password) {
      const { userId } = user;
      return { userId, username };
    }

    return null;
  }

  login(user: Login): Token {
    const payload = { ...user };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async register(user: UserDto): Promise <User> {
    return this.usersService.create(user).catch(err => {throw err; });
  }

}
