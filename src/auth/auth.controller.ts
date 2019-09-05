import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Token } from './token.interface';
import { UserDto } from '../users/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<Token> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() user: UserDto) {
    await this.authService.register(user);
  }
}
