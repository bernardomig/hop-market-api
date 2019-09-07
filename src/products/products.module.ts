import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { QrcodeService } from '../qrcode.service';
import { FilesService } from '../files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService, QrcodeService, FilesService],
  exports: [ProductsService],
})
export class ProductsModule {}
