import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { QrcodeService } from './qrcode/qrcode.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'hopmarket',
      password: 'hopmarket',
      database: 'hopmarket',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [QrcodeService],
  exports: [QrcodeService]
})
export class AppModule { }
