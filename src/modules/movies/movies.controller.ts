import { Controller, Get, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { SearchMoviesDto, MovieDetailDto } from './dto/movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  async searchMovies(@Query() searchDto: SearchMoviesDto) {
    return this.moviesService.searchMovies(searchDto);
  }

  @Get(':imdbID')
  async getMovieDetails(@Param() params: MovieDetailDto) {
    return this.moviesService.getMovieDetails(params.imdbID);
  }
}
