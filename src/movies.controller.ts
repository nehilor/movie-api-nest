import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page_offset') pageOffset: string = '1',
    @Query('page_size') pageSize: string = '10',
    @Query('order_by') orderBy: string = 'imdbID',
    @Query('sort_direction') sortDirection: string = 'ascending',
    @Query('type') type?: string,
    @Query('year') year?: string,
  ) {
    return this.moviesService.searchMovies(
      query,
      pageOffset,
      pageSize,
      orderBy,
      sortDirection,
      type,
      year,
    );
  }

  @Get(':imdbID')
  async getMovieDetails(@Param('imdbID') imdbID: string) {
    return this.moviesService.getMovieDetails(imdbID);
  }
}
