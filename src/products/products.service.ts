import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './product.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    return this.productsRepository.findOne(id);
  }

  async create(product: ProductDto, userId: number): Promise<Product> {
    const newProduct = this.productsRepository.create({
      userId,
      ...product,
    });

    return this.productsRepository.save(newProduct);
  }

  async delete(productId: number, userId: number) {
    const product = await this.findOne(productId);

    if (product.userId !== userId) {
      throw new ForbiddenException('you are not the owner of the product');
    }

    this.productsRepository.delete(product);
  }
}
