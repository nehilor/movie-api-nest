import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { MoviesService } from './movies.service';
import { of } from 'rxjs';

describe('MoviesService', () => {
  let service: MoviesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return search results when API key is configured', async () => {
      const mockResponse = {
        data: {
          Search: [{ Title: 'Batman', Year: '1989', imdbID: 'tt0096895' }],
          totalResults: '1',
          Response: 'True',
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse) as any);

      // Mock the API key
      jest
        .spyOn(service as any, 'omdbApiKey', 'get')
        .mockReturnValue('valid-key');

      const result = await service.searchMovies('batman', '1');
      expect(result).toEqual(mockResponse.data);
    });

    it('should return error when API key is not configured', async () => {
      jest
        .spyOn(service as any, 'omdbApiKey', 'get')
        .mockReturnValue('your_api_key_here');

      const result = await service.searchMovies('batman', '1');
      expect(result.Response).toBe('False');
      expect(result.Error).toContain('OMDb API key not configured');
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details when API key is configured', async () => {
      const mockResponse = {
        data: {
          Title: 'Batman',
          Year: '1989',
          imdbID: 'tt0096895',
          Plot: 'The Dark Knight of Gotham City begins his war on crime.',
          Response: 'True',
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse) as any);
      jest
        .spyOn(service as any, 'omdbApiKey', 'get')
        .mockReturnValue('valid-key');

      const result = await service.getMovieDetails('tt0096895');
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when API key is not configured', async () => {
      jest
        .spyOn(service as any, 'omdbApiKey', 'get')
        .mockReturnValue('your_api_key_here');

      await expect(service.getMovieDetails('tt0096895')).rejects.toThrow(
        'OMDb API key not configured',
      );
    });
  });
});
