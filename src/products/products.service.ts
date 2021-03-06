import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
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

  async listIngredients(productId: number): Promise<Product[]> {
    const product = await this.productsRepository.findOne(productId, {
      relations: ['ingredients'],
    });

    if (!product) {
      throw new BadRequestException('product does not exist');
    }

    return product.ingredients;
  }

  async latest(): Promise<Product[]> {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async create(product: Product): Promise<Product> {
    const newProduct = await this.productsRepository.create(product);

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

  async search(query: string): Promise<Product[]> {
    return this.productsRepository.find({ name: Like(`%${query}%`) });
  }
}
