import { Injectable } from '@nestjs/common';
import { OMDbService } from '../../shared/services/omdb.service';
import { SearchMoviesDto } from './dto/movies.dto';
import { SearchResponse, OMDbMovie } from './interfaces/movie.interface';
import { API_CONSTANTS } from '../../shared/constants/api.constants';

@Injectable()
export class MoviesService {
  constructor(private readonly omdbService: OMDbService) {}

  async searchMovies(searchDto: SearchMoviesDto): Promise<SearchResponse> {
    try {
      // Check if API key is configured
      if (!this.omdbService.isApiKeyConfigured()) {
        return {
          Search: [],
          totalResults: '0',
          Response: 'False',
          Error:
            'OMDb API key not configured. Please set OMDB_API_KEY in your .env file',
          pagination: {
            page_offset: parseInt(searchDto.page_offset || '1', 10),
            page_size: parseInt(searchDto.page_size || '10', 10),
            sort_order: [
              {
                order_by: searchDto.order_by || 'imdbID',
                sort_direction: searchDto.sort_direction || 'ascending',
              },
            ],
          },
        };
      }

      const requestedPageSize = parseInt(searchDto.page_size || '10', 10);
      const requestedPageOffset = parseInt(searchDto.page_offset || '1', 10);

      // OMDb API limitation: max 10 results per page
      const omdbPageSize = API_CONSTANTS.OMDb.MAX_RESULTS_PER_PAGE;

      // Calculate how many OMDb pages we need to fetch to get the requested page size
      const omdbPagesNeeded = Math.ceil(requestedPageSize / omdbPageSize);

      // Calculate which OMDb pages we need to fetch
      const startOmdbPage = requestedPageOffset;
      const endOmdbPage = startOmdbPage + omdbPagesNeeded - 1;

      let allResults: OMDbMovie[] = [];
      let totalResults = '0';

      // Fetch multiple pages from OMDb if needed
      for (let omdbPage = startOmdbPage; omdbPage <= endOmdbPage; omdbPage++) {
        const omdbResponse = await this.omdbService.searchMovies({
          query: searchDto.query,
          page: omdbPage.toString(),
          type: searchDto.type,
          year: searchDto.year,
        });

        if (omdbResponse.Response === 'False') {
          // If this is the first page and it fails, return the error
          if (omdbPage === startOmdbPage) {
            return {
              Search: [],
              totalResults: '0',
              Response: 'False',
              Error: omdbResponse.Error,
              pagination: {
                page_offset: requestedPageOffset,
                page_size: requestedPageSize,
                sort_order: [
                  {
                    order_by: searchDto.order_by || 'imdbID',
                    sort_direction: searchDto.sort_direction || 'ascending',
                  },
                ],
              },
            };
          }
          // If later pages fail, just break and use what we have
          break;
        }

        if (omdbResponse.Search) {
          allResults = allResults.concat(omdbResponse.Search);
        }

        // Get total results from the first successful response
        if (omdbPage === startOmdbPage && omdbResponse.totalResults) {
          totalResults = omdbResponse.totalResults;
        }
      }

      // Apply sorting if needed
      if (searchDto.order_by && searchDto.sort_direction) {
        allResults = this.sortMovies(
          allResults,
          searchDto.order_by,
          searchDto.sort_direction,
        );
      }

      // Apply page size limit to the combined results
      const finalResults = allResults.slice(0, requestedPageSize);

      return {
        Search: finalResults,
        totalResults: totalResults,
        Response: 'True',
        pagination: {
          page_offset: requestedPageOffset,
          page_size: requestedPageSize,
          sort_order: [
            {
              order_by: searchDto.order_by || 'imdbID',
              sort_direction: searchDto.sort_direction || 'ascending',
            },
          ],
        },
      };
    } catch (error) {
      throw new Error(`Failed to search movies: ${error.message}`);
    }
  }

  async getMovieDetails(imdbID: string) {
    try {
      // Check if API key is configured
      if (!this.omdbService.isApiKeyConfigured()) {
        throw new Error(
          'OMDb API key not configured. Please set OMDB_API_KEY in your .env file',
        );
      }

      const movieDetail = await this.omdbService.getMovieDetail(imdbID);

      if (movieDetail.Response === 'False') {
        throw new Error((movieDetail as any).Error || 'Movie not found');
      }

      return movieDetail;
    } catch (error) {
      throw new Error(`Failed to get movie details: ${error.message}`);
    }
  }

  private sortMovies(
    movies: OMDbMovie[],
    orderBy: string,
    sortDirection: string,
  ): OMDbMovie[] {
    return movies.sort((a, b) => {
      let aValue = (a as any)[orderBy];
      let bValue = (b as any)[orderBy];

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
}
