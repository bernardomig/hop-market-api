import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiModelProperty,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { Login } from 'src/auth/login.interface';
import { Item } from './item.entity';
import { ItemsService } from './items.service';

class ItemIdDto {
  @ApiModelProperty({ example: '17' })
  itemId: number;
}

class ItemCreateDto {
  @ApiModelProperty({ description: 'The ID of the product.', example: '88' })
  productId: number;

  @ApiModelProperty({
    description: 'This is the coordinates related to each transaction.',
    example: '40.63030438865182,-8.657526969909668',
  })
  location: string;
}

@ApiUseTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiOperation({ title: 'Lists all the items' })
  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @ApiOperation({ title: 'Lists the items from a specific product' })
  @Get('by-product/:id')
  async findByProduct(@Param('id') userId: number): Promise<Item[]> {
    return this.itemsService.findByUser(userId);
  }

  @ApiOperation({ title: 'Lists the items belonging to the login user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('mine')
  async findMine(@Request() req: { user: Login }): Promise<Item[]> {
    const { userId } = req.user;

    return this.itemsService.findByUser(userId);
  }

  @ApiOperation({ title: 'Gets a specific item' })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @ApiOperation({ title: 'Creates a new item' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Item was successfully created' })
  @ApiBadRequestResponse({
    description: 'You have no permissions to create the item',
  })
  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Request() request: { user: Login },
    @Body() body: ItemCreateDto,
  ) {
    const { userId } = request.user;

    const item = {
      userId,
      ...body,
    };

    const { location } = body;

    location.replace(',', ' ');

    const { itemId } = await this.itemsService.create(item);

    return { itemId };
  }
}
