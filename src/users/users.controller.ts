import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiUseTags,
  ApiModelProperty,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiUseTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersService) { }

  @ApiOperation({ title: 'Returns all the users' })
  @ApiResponse({ status: 200 })
  @Get()
  async findAll() {
    return this.usersRepository.findAll();
  }

  @ApiOperation({ title: 'Returns an user that corresponds to the ID' })
  @ApiResponse({ status: 200 })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.usersRepository.findOne(id);
  }
}

