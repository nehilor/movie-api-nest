import { IsString, IsOptional, IsNumberString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchMoviesDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value || '1')
  page_offset?: string = '1';

  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => value || '10')
  page_size?: string = '10';

  @IsOptional()
  @IsIn(['Title', 'Year', 'imdbID', 'Type'])
  @Transform(({ value }) => value || 'imdbID')
  order_by?: string = 'imdbID';

  @IsOptional()
  @IsIn(['ascending', 'descending'])
  @Transform(({ value }) => value || 'ascending')
  sort_direction?: string = 'ascending';

  @IsOptional()
  @IsIn(['movie', 'series', 'episode'])
  type?: string;

  @IsOptional()
  @IsString()
  year?: string;
}

export class MovieDetailDto {
  @IsString()
  imdbID: string;
}
