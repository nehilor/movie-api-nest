import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(@Body('imdbID') imdbID: string) {
    return this.favoritesService.addFavorite(imdbID);
  }

  @Delete(':imdbID')
  removeFavorite(@Param('imdbID') imdbID: string) {
    return this.favoritesService.removeFavorite(imdbID);
  }

  @Get()
  getFavorites() {
    return this.favoritesService.getFavorites();
  }

  @Get(':imdbID')
  isFavorite(@Param('imdbID') imdbID: string) {
    return { isFavorite: this.favoritesService.isFavorite(imdbID) };
  }

  @Delete()
  clearFavorites() {
    return this.favoritesService.clearFavorites();
  }
}
