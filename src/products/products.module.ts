import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductPhoto } from './product.entity';
import { PassportModule, AuthGuard } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { QrcodeService } from '../qrcode/qrcode.service';
import { FilesService } from '../files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductPhoto]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, QrcodeService, FilesService],
  exports: [ProductsService],
})
export class ProductsModule {}
