import { Controller, Get, Param } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiUseTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersService) {}

  @Get()
  async findAll() {
    return this.usersRepository.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersRepository.findOne(id);
  }
}
