import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { OMDbService } from '../../shared/services/omdb.service';
import { SearchMoviesDto } from './dto/movies.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let omdbService: OMDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: OMDbService,
          useValue: {
            searchMovies: jest.fn(),
            getMovieDetail: jest.fn(),
            isApiKeyConfigured: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    omdbService = module.get<OMDbService>(OMDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return search results when API key is configured', async () => {
      const mockOmdbResponse = {
        Search: [
          {
            Title: 'Batman',
            Year: '1989',
            imdbID: 'tt0096895',
            Type: 'movie',
            Poster: 'poster.jpg',
          },
        ],
        totalResults: '1',
        Response: 'True',
      };

      const searchDto: SearchMoviesDto = {
        query: 'batman',
        page_offset: '1',
        page_size: '10',
        order_by: 'imdbID',
        sort_direction: 'ascending',
      };

      jest.spyOn(omdbService, 'isApiKeyConfigured').mockReturnValue(true);
      jest
        .spyOn(omdbService, 'searchMovies')
        .mockResolvedValue(mockOmdbResponse);

      const result = await service.searchMovies(searchDto);

      expect(result.Search).toEqual(mockOmdbResponse.Search);
      expect(result.totalResults).toBe('1');
      expect(result.Response).toBe('True');
      expect(result.pagination).toBeDefined();
    });

    it('should return error when API key is not configured', async () => {
      const searchDto: SearchMoviesDto = {
        query: 'batman',
        page_offset: '1',
        page_size: '10',
        order_by: 'imdbID',
        sort_direction: 'ascending',
      };

      jest.spyOn(omdbService, 'isApiKeyConfigured').mockReturnValue(false);

      const result = await service.searchMovies(searchDto);

      expect(result.Response).toBe('False');
      expect(result.Error).toContain('OMDb API key not configured');
      expect(result.Search).toEqual([]);
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details when API key is configured', async () => {
      const mockMovieDetail = {
        Title: 'Batman',
        Year: '1989',
        imdbID: 'tt0096895',
        Plot: 'The Dark Knight of Gotham City begins his war on crime.',
        Response: 'True',
      };

      jest.spyOn(omdbService, 'isApiKeyConfigured').mockReturnValue(true);
      jest
        .spyOn(omdbService, 'getMovieDetail')
        .mockResolvedValue(mockMovieDetail);

      const result = await service.getMovieDetails('tt0096895');

      expect(result).toEqual(mockMovieDetail);
    });

    it('should throw error when API key is not configured', async () => {
      jest.spyOn(omdbService, 'isApiKeyConfigured').mockReturnValue(false);

      await expect(service.getMovieDetails('tt0096895')).rejects.toThrow(
        'OMDb API key not configured',
      );
    });
  });
});
