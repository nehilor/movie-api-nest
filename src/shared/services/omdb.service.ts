import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  OMDbSearchResponse,
  OMDbMovieDetail,
} from '../../modules/movies/interfaces/movie.interface';

@Injectable()
export class OMDbService {
  private readonly omdbApiKey = process.env.OMDB_API_KEY || 'demo';
  private readonly omdbBaseUrl = 'http://www.omdbapi.com';

  constructor(private readonly httpService: HttpService) {}

  async searchMovies(params: {
    query: string;
    page: string;
    type?: string;
    year?: string;
  }): Promise<OMDbSearchResponse> {
    const requestParams = {
      apikey: this.omdbApiKey,
      s: params.query,
      page: params.page,
      ...(params.type && { type: params.type }),
      ...(params.year && { y: params.year }),
    };

    const response = await firstValueFrom(
      this.httpService.get(this.omdbBaseUrl, { params: requestParams }),
    );

    return response.data;
  }

  async getMovieDetail(imdbID: string): Promise<OMDbMovieDetail> {
    const params = {
      apikey: this.omdbApiKey,
      i: imdbID,
      plot: 'full',
    };

    const response = await firstValueFrom(
      this.httpService.get(this.omdbBaseUrl, { params }),
    );

    return response.data;
  }

  isApiKeyConfigured(): boolean {
    return this.omdbApiKey !== 'demo' && !!this.omdbApiKey;
  }
}
