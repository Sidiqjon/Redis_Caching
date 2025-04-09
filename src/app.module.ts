// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { PrismaModule } from './prisma/prisma.module';
// import { UploadModule } from './upload/upload.module';
// import { MailModule } from './mail/mail.module';
// import { UserModule } from './user/user.module';
// import { ProductModule } from './product/product.module';
// import { AuthModule } from './auth/auth.module';
// import { CategoryModule } from './category/category.module';

// @Module({
//   imports: [UploadModule, PrismaModule, AuthModule, MailModule, CategoryModule, ProductModule, UserModule ],
//   controllers: [],
//   providers: [],
// })
// export class AppModule {}



import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost', 
      port: 6379,
      ttl: 60,        
    }),
    UploadModule,
    PrismaModule,
    AuthModule,
    MailModule,
    CategoryModule,
    ProductModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
