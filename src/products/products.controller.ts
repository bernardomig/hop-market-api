import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiModelProperty,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { Length, IsArray } from 'class-validator';

import { Login } from '../auth/login.interface';
import { FilesService } from '../files.service';
import { ProductsService } from './products.service';

export class CreateProductDto {
  @Length(5)
  @ApiModelProperty({
    description: 'The name of the product.',
    required: true,
    example: 'apple pie',
  })
  name: string;

  @ApiModelProperty({
    description: 'The description of the product.',
    required: true,
    example: `This pie is made of apples and is provided by the bakery 'Lusitana'.`,
  })
  description: string = '';

  @ApiModelProperty({
    description: 'The ingredients that make up the final product.',
    required: false,
    example: [1, 2],
    default: [],
  })
  @IsArray({ message: 'Should be an array' })
  ingredients: number[] = [];

  @ApiModelProperty({
    description: 'The url of the products photo',
  })
  photo: string;
}

export class ProductBriefDto {
  @ApiModelProperty({
    description: 'The id of the product.',
    required: true,
    example: 32,
  })
  @Expose()
  productId: number;

  @ApiModelProperty({
    description: 'The id of the user.',
    required: true,
    example: 1,
  })
  @Expose()
  userId: number;

  @ApiModelProperty({ description: 'The name of the product.' })
  @Expose()
  name: string;

  @ApiModelProperty({ description: 'the photo url of the product' })
  @Expose()
  photo: string;
}

const productBriefTransform = product =>
  plainToClass(ProductBriefDto, product, { excludeExtraneousValues: true });

@ApiUseTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileService: FilesService,
  ) {}

  @Get('search')
  async search(@Query('q') query: string): Promise<ProductBriefDto[]> {
    const products = await this.productsService.search(query);

    return products.map(productBriefTransform);
  }

  @ApiOperation({ title: 'Finds all the products' })
  @Get()
  async findAll(): Promise<ProductBriefDto[]> {
    const products = await this.productsService.findAll();

    return products.map(productBriefTransform);
  }

  @ApiOperation({ title: 'Finds the newest created products' })
  @ApiResponse({ status: 200, type: ProductBriefDto })
  @Get('latest')
  async latest(): Promise<ProductBriefDto[]> {
    const products = await this.productsService.latest();

    return products.map(productBriefTransform);
  }

  @ApiOperation({ title: 'Finds the products created by a specific user' })
  @Get('by-user/:id')
  async findAllByUser(@Param('id') id: number) {
    return this.productsService.findOneByUser(id);
  }

  @ApiOperation({ title: 'Lists the products created by the login user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('mine')
  async findMyProducts(@Request() request: { user: Login }) {
    const { userId } = request.user;

    return this.productsService.findOneByUser(userId);
  }

  @ApiOperation({ title: 'Finds a specific product' })
  @Get(':id')
  async findOne(@Param('id') productId: number) {
    return this.productsService.findOne(productId);
  }

  @ApiOperation({ title: 'Lists the ingredients of a product' })
  @Get(':id/ingredients')
  async listIngredients(@Param('id') id: number): Promise<ProductBriefDto[]> {
    const products = await this.productsService.listIngredients(id);

    return products.map(productBriefTransform);
  }

  // @ApiConsumes('multipart/form-data')
  @ApiOperation({ title: 'Creates a new product' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Request() request: { user: Login },
    @Body() product: CreateProductDto,
  ) {
    const { userId } = request.user;

    const { name, description, ingredients, photo } = product;

    const { productId } = await this.productsService.create({
      name,
      description: description || '',
      ingredients: !ingredients
        ? []
        : await Promise.all(
            ingredients.map(ingredientId =>
              this.productsService.findOne(ingredientId),
            ),
          ),
      userId,
      photo,
    });

    return {
      productId,
    };
  }

  @ApiOperation({ title: 'Deletes a product' })
  @ApiBearerAuth()
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
