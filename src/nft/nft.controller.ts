import { Controller, Get, Query } from '@nestjs/common';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  // @Get('data')
  // async getNftData(
  //   @Query('owner') owner: string,
  //   @Query('collection') collection?: string,
  //   @Query('limit') limit?: number,
  //   @Query('next') next?: string,
  // ) {
  //   try {
  //     const response = await this.nftService
  //       .getNftData(owner, collection, limit, next)
  //       .toPromise();
  //     return response.data;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch NFT data: ${error.message}`);
  //   }
  // }

  @Get('data')
  async getNftDataWithCache(
    @Query('owner') owner: string,
    @Query('collection') collection?: string,
  ) {
    try {
      const response = await this.nftService.getNftDataWithCache(
        owner,
        collection,
      );
      return response; // Directly return the data
    } catch (error) {
      throw new Error(`Failed to fetch NFT data: ${error.message}`);
    }
  }
}
