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

  getNftData(
    ownerAddress: string,
    collection?: string,
    limit?: number,
    next?: string,
  ): Observable<AxiosResponse<any>> {
    const url = `${this.OS_GET_NFT_URL}/${ownerAddress}/nfts`;
    const headers = {
      accept: 'application/json',
      'x-api-key': this.OS_API_KEY,
    };

    const params: any = {};
    if (collection) params.collection = collection;
    if (limit) params.limit = limit;
    if (next) params.next = next;

    return this.httpService.get(url, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error fetching NFT data:', error);
        return throwError(() => new Error('Error fetching NFT data'));
      }),
    );
  }
}
