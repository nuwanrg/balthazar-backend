import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NftService {
  private readonly OS_GET_NFT_URL: string;
  private readonly OS_API_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.OS_GET_NFT_URL = this.configService.get<string>('OS_GET_NFT_URL');
    this.OS_API_KEY = this.configService.get<string>('OS_API_KEY');
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
