import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Redis from 'ioredis';

@Injectable()
export class NftService {
  private readonly OS_GET_NFT_URL: string;
  private readonly OS_API_KEY: string;
  private readonly redisClient: Redis | null;
  private readonly useCache: boolean;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') redisClient: Redis | null,
  ) {
    this.OS_GET_NFT_URL = this.configService.get<string>('OS_GET_NFT_URL');
    this.OS_API_KEY = this.configService.get<string>('OS_API_KEY');
    this.redisClient = redisClient;
    this.useCache = this.configService.get<string>('USE_CACHE') === 'true';
  }

  /**
   * Fetch NFT data with caching for a given owner address with optional query parameters.
   *
   * @param ownerAddress - The address of the NFT owner.
   * @param collection - (Optional) The collection to filter the NFTs.
   * @returns A promise containing the NFT data.
   */
  async getNftDataWithCache(
    ownerAddress: string,
    collection?: string,
  ): Promise<any> {
    const cacheKey = `${ownerAddress}-${collection}`;
    if (this.useCache && this.redisClient) {
      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    }

    const url = `${this.OS_GET_NFT_URL}/${ownerAddress}/nfts`;
    const headers = {
      accept: 'application/json',
      'x-api-key': this.OS_API_KEY,
    };

    const params: any = {};
    if (collection) params.collection = collection;

    try {
      const response = await this.httpService
        .get(url, { headers, params })
        .toPromise();
      if (this.useCache && this.redisClient) {
        await this.redisClient.set(
          cacheKey,
          JSON.stringify(response.data),
          'EX',
          3600,
        ); // Cache for 1 hour
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      throw new Error('Error fetching NFT data');
    }
  }

  /**
   * Fetch NFT data for a given owner address with optional query parameters.
   *
   * @param ownerAddress - The address of the NFT owner.
   * @param collection - (Optional) The collection to filter the NFTs.
   * @param limit - (Optional) The maximum number of NFTs to return.
   * @param next - (Optional) The token for pagination to fetch the next set of NFTs.
   * @returns An Observable of AxiosResponse containing the NFT data.
   */
  getNftData(
    ownerAddress: string,
    collection?: string,
    limit?: number,
    next?: string,
  ): Observable<AxiosResponse<any>> {
    // Construct the URL with the owner address
    const url = `${this.OS_GET_NFT_URL}/${ownerAddress}/nfts`;

    // Set the headers including the API key
    const headers = {
      accept: 'application/json',
      'x-api-key': this.OS_API_KEY,
    };

    // Initialize the query parameters object
    const params: any = {};
    if (collection) params.collection = collection;
    if (limit) params.limit = limit;
    if (next) params.next = next;

    // Make the HTTP GET request with the constructed URL, headers, and parameters
    return this.httpService.get(url, { headers, params }).pipe(
      // Handle any errors that occur during the request
      catchError((error) => {
        console.error('Error fetching NFT data:', error);
        return throwError(() => new Error('Error fetching NFT data'));
      }),
    );
  }
}
