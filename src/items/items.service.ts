import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.find();
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.itemsRepository.findOne(id);

    if (!item) {
      throw new BadRequestException('item not found');
    }

    return item;
  }

  async findByUser(userId: number): Promise<Item[]> {
    return this.itemsRepository.find({ userId });
  }

  async create(item: Item): Promise<Item> {
    const { userId, productId } = item;

    const user = await this.usersService.findOne(userId);
    const product = await this.productsService.findOne(productId);

    if (!product) {
      throw new BadRequestException('product does not exist');
    }

    if (user.userId !== product.userId) {
      throw new BadRequestException(
        'can only create items from owned products',
      );
    }

    const newItem = await this.itemsRepository.create(item);

    return this.itemsRepository.save(newItem);
  }

  async transfer(itemId: number, ownerId: number, buyerId: number) {
    const item = await this.findOne(itemId);

    if (ownerId !== item.userId) {
      throw new BadRequestException('only the owner can transfer the product');
    }

    const buyer = await this.usersService.findOne(buyerId);
  }
}
