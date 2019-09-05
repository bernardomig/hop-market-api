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

  async findOneByUser(userId: number): Promise<Product[]> {
    return this.productsRepository.find({ userId });
  }

  async latest(): Promise<Product[]> {
    return this.productsRepository.find({
      order: { createAt: 'DESC' },
      take: 10,
    });
  }

  async create(product: Product, userId: number): Promise<Product> {
    const newProduct = this.productsRepository.create({
      ...product,
      userId,
    });

    return this.productsRepository.save(newProduct);
  }

  async delete(productId: number, userId: number) {
    const product = await this.findOne(productId);

    if (!product) {
      throw new BadRequestException('product not found');
    }

    if (product.userId !== userId) {
      throw new ForbiddenException('you are not the owner of the product');
    }

    await this.productsRepository.remove(product);
  }
}
