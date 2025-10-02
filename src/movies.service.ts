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
    pageOffset: string = '1',
    pageSize: string = '10',
    orderBy: string = 'imdbID',
    sortDirection: string = 'ascending',
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

      // Convert page_offset to OMDb page format (OMDb uses 1-based pages)
      const omdbPage = pageOffset;

      const params = {
        apikey: this.omdbApiKey,
        s: query,
        page: omdbPage,
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

      // Apply sorting if needed (OMDb doesn't support custom sorting, so we do it here)
      let searchResults = response.data.Search || [];

      if (orderBy && sortDirection) {
        searchResults = this.sortMovies(searchResults, orderBy, sortDirection);
      }

      // Apply page size limit (OMDb returns 10 results per page by default)
      const pageSizeNum = parseInt(pageSize, 10);
      if (pageSizeNum !== 10) {
        searchResults = searchResults.slice(0, pageSizeNum);
      }

      return {
        ...response.data,
        Search: searchResults,
        pagination: {
          page_offset: parseInt(pageOffset, 10),
          page_size: parseInt(pageSize, 10),
          sort_order: [
            {
              order_by: orderBy,
              sort_direction: sortDirection,
            },
          ],
        },
      };
    } catch (error) {
      throw new Error(`Failed to search movies: ${error.message}`);
    }
  }

  private sortMovies(movies: any[], orderBy: string, sortDirection: string) {
    return movies.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle different data types
      if (orderBy === 'Year') {
        aValue = parseInt(aValue, 10) || 0;
        bValue = parseInt(bValue, 10) || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'descending') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });
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
