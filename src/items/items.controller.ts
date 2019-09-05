import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
  Param,
} from '@nestjs/common';
import { Item } from './item.entity';
import { ItemsService } from './items.service';
import { AuthGuard } from '@nestjs/passport';
import { Login } from 'src/auth/login.interface';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Request() request: { user: Login },
    @Body() body: { productId: number },
  ) {
    const { userId } = request.user;
    const { productId } = body;

    const { itemId } = await this.itemsService.create(userId, productId);

    return { itemId };
  }
}
