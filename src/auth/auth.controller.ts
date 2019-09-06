import {
  Controller,
  Post,
  Request,
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Token } from './token.interface';
import { UserDto } from '../users/user.dto';
import {
  ApiUseTags,
  ApiModelProperty,
  ApiImplicitBody,
  ApiOperation,
  ApiForbiddenResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Length, IsAlphanumeric, IsEmail, IsNumber, IsDate } from 'class-validator';

export class LoginDto {
  @ApiModelProperty({ example: 'johndoe', required: true, minLength: 7 })
  @Length(7)
  @IsAlphanumeric()
  username: string;

  @ApiModelProperty({ example: 'changeme', required: true, minLength: 8 })
  @Length(8)
  password: string;
}

export class LoginTokenDto {
  @ApiModelProperty({ description: 'The bearer token.' })
  token: string;
}

export class RegisterDto extends LoginDto {

  @ApiModelProperty({ example: 'Bernardo', required: true, description: 'User\'s first name.' })
  @IsAlphanumeric()
  first_name: string;

  @ApiModelProperty({ example: 'Lourenço', required: true, description: 'User\'s surname.' })
  @IsAlphanumeric()
  surname: string;

  @ApiModelProperty({ example: 'benny_benassi@ua.pt', required: true, description: 'User\'s email.' })
  @IsEmail()
  email: string;

}

@ApiUseTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({ title: 'Logins the user' })
  @ApiImplicitBody({ type: LoginDto, name: 'Login' })
  @ApiCreatedResponse({
    description: 'Login was successful',
    type: LoginTokenDto,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: user or password might be incorrect',
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<Token> {
    return this.authService.login(req.user);
  }

  @ApiOperation({ title: 'Registers a new user' })
  @Post('register')
  async register(@Body() user: RegisterDto) {
    await this.authService.register(user);
  }
}
