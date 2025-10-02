import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  private readonly omdbApiKey = process.env.OMDB_API_KEY || 'demo';
  private readonly omdbBaseUrl = 'http://www.omdbapi.com';

  constructor(private readonly httpService: HttpService) {}

  async searchMovies(
    query: string,
    page: string = '1',
    type?: string,
    year?: string,
  ) {
    try {
      // Check if API key is configured
      if (!this.omdbApiKey) {
        return {
          Search: [],
          totalResults: '0',
          Response: 'False',
          Error:
            'OMDb API key not configured. Please set OMDB_API_KEY in your .env file',
        };
      }

      const params = {
        apikey: this.omdbApiKey,
        s: query,
        page: page,
        ...(type && { type }),
        ...(year && { y: year }),
      };

      const response = await firstValueFrom(
        this.httpService.get(this.omdbBaseUrl, { params }),
      );

      if (response.data.Response === 'False') {
        return {
          Search: [],
          totalResults: '0',
          Response: 'False',
          Error: response.data.Error,
        };
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to search movies: ${error.message}`);
    }
  }

  async getMovieDetails(imdbID: string) {
    try {
      // Check if API key is configured
      if (this.omdbApiKey === 'your_api_key_here' || !this.omdbApiKey) {
        throw new Error(
          'OMDb API key not configured. Please set OMDB_API_KEY in your .env file',
        );
      }

      const params = {
        apikey: this.omdbApiKey,
        i: imdbID,
        plot: 'full',
      };

      const response = await firstValueFrom(
        this.httpService.get(this.omdbBaseUrl, { params }),
      );

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error || 'Movie not found');
      }

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get movie details: ${error.message}`);
    }
  }
}
