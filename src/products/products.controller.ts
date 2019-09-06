import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiImplicitFile,
  ApiModelProperty,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { Length } from 'class-validator';
import { Response } from 'express';
import { Login } from '../auth/login.interface';
import { FilesService } from '../files.service';
import { QrcodeService } from '../qrcode/qrcode.service';
import { ProductsService } from './products.service';
import { userInfo } from 'os';

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
    example:
      'This pie is made of apples and is provided by the bakery "Lusitana".',
  })
  description: string = '';

  @ApiModelProperty({
    description: 'The ingredients that make up the final product.',
    required: false,
    example: 'apples,sugar,flour,milk',
  })
  ingredients: number[] = [];
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

  @Get('photos')
  async photos(): Promise<number[]> {
    return [];
  }

  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'files', description: 'List of cats' })
  @Post('photos')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPhotos(@UploadedFiles() files: any[]) {
    return files.map(({ buffer, originalname, mimetype }) =>
      this.fileService.upload('images', originalname, buffer, mimetype),
    );
  }

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

  @Get(':id/photos')
  async listPhotos(@Param('id') id: number) {
    const photos = await this.productsService.findPhotos(id);

    return photos.map(({ photoId, url }) => ({
      photoId,
      url,
    }));
  }

  @Put(':id/photos')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async addPhotos(
    @Request() req: { user: Login },
    @Param('id') id: number,
    @UploadedFiles() files: any[],
  ) {
    const product = await this.productsService.findOne(id);

    if (product.userId !== req.user.userId) {
      throw new ForbiddenException('Add photos to product not allowed');
    }

    const urls = files.map(({ buffer, originalname, mimetype }) =>
      this.fileService.upload('images', originalname, buffer, mimetype),
    );

    return Promise.all(
      urls.map(url =>
        this.productsService
          .addPhoto({
            url,
            product: this.productsService.findOne(id),
            productId: product.productId,
          })
          .then(({ url }) => url),
      ),
    );
  }

  @ApiOperation({ title: 'Creates a new product' })
  @ApiBearerAuth()
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
