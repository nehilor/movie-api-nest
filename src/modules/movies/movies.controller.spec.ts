import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            searchMovies: jest.fn(),
            getMovieDetails: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should return search results', async () => {
      const mockResults = {
        Search: [{ Title: 'Batman', Year: '1989', imdbID: 'tt0096895' }],
        totalResults: '1',
        Response: 'True',
      };

      jest.spyOn(service, 'searchMovies').mockResolvedValue(mockResults);

      const result = await controller.searchMovies('batman', '1');
      expect(result).toEqual(mockResults);
      expect(service.searchMovies).toHaveBeenCalledWith(
        'batman',
        '1',
        undefined,
        undefined,
      );
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details', async () => {
      const mockDetails = {
        Title: 'Batman',
        Year: '1989',
        imdbID: 'tt0096895',
        Plot: 'The Dark Knight of Gotham City begins his war on crime.',
        Response: 'True',
      };

      jest.spyOn(service, 'getMovieDetails').mockResolvedValue(mockDetails);

      const result = await controller.getMovieDetails('tt0096895');
      expect(result).toEqual(mockDetails);
      expect(service.getMovieDetails).toHaveBeenCalledWith('tt0096895');
    });
  });
});
