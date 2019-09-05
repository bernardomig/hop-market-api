import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Login } from '../auth/login.interface';
import { Product } from './product.entity';
import { ProductsService } from './products.service';
import {
  ApiUseTags,
  ApiModelProperty,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { Length } from 'class-validator';
import { QrcodeService } from '../qrcode/qrcode.service';
import { plainToClass, classToPlain, Expose } from 'class-transformer';

export class CreateProductDto {
  @Length(5)
  name: string;

  description: string = '';

  ingredients: number[] = [];
}

export class ProductBriefDto {
  @ApiModelProperty({
    description: 'the id of the product',
    required: true,
    example: 32,
  })
  @Expose()
  productId: number;

  @Expose()
  userId: number;

  @ApiModelProperty({ description: 'the name of the product' })
  @Expose()
  name: string;
}

const productBriefTransform = product =>
  plainToClass(ProductBriefDto, product, { excludeExtraneousValues: true });

@ApiUseTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly qrCodeService: QrcodeService,
  ) {}

  @Get()
  async findAll(): Promise<ProductBriefDto[]> {
    const products = await this.productsService.findAll();

    return products.map(productBriefTransform);
  }

  @Get(':id/qr')
  async generateQrCode(@Param('id') id: number): Promise<string> {
    const product = await this.productsService.findOne(id);

    const code = `product:${id}`;

    return this.qrCodeService.encode(code);
  }

  @ApiResponse({ status: 200, type: ProductBriefDto })
  @Get('latest')
  async latest(): Promise<ProductBriefDto[]> {
    const products = await this.productsService.latest();

    return products.map(productBriefTransform);
  }

  @Get('by-user/:id')
  async findAllByUser(@Param('id') id: number) {
    return this.productsService.findOneByUser(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('mine')
  async findMyProducts(@Request() request: { user: Login }) {
    const { userId } = request.user;

    return this.productsService.findOneByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id') productId: number) {
    return this.productsService.findOne(productId);
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Request() request: { user: Login },
    @Body() product: CreateProductDto,
  ) {
    const { userId } = request.user;

    const { name, description, ingredients } = product;

    const { productId } = await this.productsService.create({
      name,
      description: description || '',
      ingredients: Promise.all(
        ingredients.map(ingredientId =>
          this.productsService.findOne(ingredientId),
        ),
      ),
      userId,
    });

    return {
      productId,
    };
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async delete(
    @Request() request: { user: Login },
    @Param('id') productId: number,
  ) {
    const { userId } = request.user;
    await this.productsService.delete(productId, userId);
  }
}
