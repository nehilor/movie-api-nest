import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  private favorites: Set<string> = new Set();

  addFavorite(imdbID: string): { success: boolean; message: string } {
    if (this.favorites.has(imdbID)) {
      return { success: false, message: 'Movie already in favorites' };
    }

    this.favorites.add(imdbID);
    return { success: true, message: 'Movie added to favorites' };
  }

  removeFavorite(imdbID: string): { success: boolean; message: string } {
    if (!this.favorites.has(imdbID)) {
      return { success: false, message: 'Movie not in favorites' };
    }

    this.favorites.delete(imdbID);
    return { success: true, message: 'Movie removed from favorites' };
  }

  getFavorites(): string[] {
    return Array.from(this.favorites);
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites.has(imdbID);
  }

  clearFavorites(): { success: boolean; message: string } {
    this.favorites.clear();
    return { success: true, message: 'All favorites cleared' };
  }
}
