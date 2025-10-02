import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMovies(
    @Query('query') query: string,
    @Query('page') page: string = '1',
    @Query('type') type?: string,
    @Query('year') year?: string,
  ) {
    return this.moviesService.searchMovies(query, page, type, year);
  }

  @Get(':imdbID')
  async getMovieDetails(@Param('imdbID') imdbID: string) {
    return this.moviesService.getMovieDetails(imdbID);
  }
}
