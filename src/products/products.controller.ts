import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Login } from 'src/auth/login.interface';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import { ApiUseTags } from '@nestjs/swagger';
import { QrcodeService } from '../qrcode/qrcode.service';

const Id = (name: string) => Param(name, new ParseIntPipe());

@ApiUseTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService, private readonly qrCodeService: QrcodeService) { }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id/qr')
  async generateQrCode(@Param('id') id: number): Promise<string> {
    const product = await this.productsService.findOne(id);

    const code = `product:${id}`

    return this.qrCodeService.encode(code);
  }

  @Get('latest')
  async latest() {
    return this.productsService.latest();
  }

  @Get('by-user/:id')
  async findAllByUser(@Param('id') id: number) {
    return this.productsService.findOneByUser(id);
  }

  @UseGuards(AuthGuard())
  @Get('mine')
  async findMyProducts(@Request() request: { user: Login }) {
    const { userId } = request.user;

    return this.productsService.findOneByUser(userId);
  }

  @Get(':id')
  async findOne(@Id('id') productId: number) {
    return this.productsService.findOne(productId);
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Request() request: { user: Login },
    @Body() product: ProductDto,
  ) {
    const { userId } = request.user;

    const { productId } = await this.productsService.create(product, userId);

    return {
      productId,
    };
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async delete(
    @Request() request: { user: Login },
    @Id('id') productId: number,
  ) {
    const { userId } = request.user;
    await this.productsService.delete(productId, userId);
  }
}
