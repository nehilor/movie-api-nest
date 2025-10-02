import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { OMDbService } from '../../shared/services/omdb.service';

@Module({
  imports: [HttpModule],
  controllers: [MoviesController],
  providers: [MoviesService, OMDbService],
  exports: [MoviesService],
})
export class MoviesModule {}
