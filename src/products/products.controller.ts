import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Body,
  Request,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';
import { AuthGuard } from '@nestjs/passport';
import { Login } from 'src/auth/login.interface';

const Id = (name: string) => Param(name, new ParseIntPipe());

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Id('id') productId) {
    return this.productsService.findOne(productId);
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(@Request() request: any, @Body() product: ProductDto) {
    const { userId } = request.user as Login;

    const { productId } = await this.productsService.create(product, userId);

    return {
      productId,
    };
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async delete(@Request() request: any, @Id('id') productId: number) {
    const { userId } = request.user as Login;
    return this.productsService.delete(productId, userId);
  }
}
