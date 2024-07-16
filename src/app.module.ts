import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NftModule } from './nft/nft.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the module globally available
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // use environment-specific file
    }),
    NftModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
