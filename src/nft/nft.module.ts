import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';

@Module({
  imports: [HttpModule],
  providers: [NftService],
  controllers: [NftController],
})
export class NftModule {}
