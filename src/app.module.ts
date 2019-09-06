import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { QrcodeService } from './qrcode/qrcode.service';

import { env } from 'process';
import { TransactionsModule } from './transactions/transactions.module';
import { FilesService } from './files.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      database: 'hopmarket',
      host: 'localhost',
      username: 'hop-market',
      password: 'password',
      logging: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    ItemsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [QrcodeService, FilesService],
  exports: [QrcodeService],
})
export class AppModule {}
