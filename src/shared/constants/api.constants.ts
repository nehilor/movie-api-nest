export const API_CONSTANTS = {
  OMDb: {
    BASE_URL: 'http://www.omdbapi.com',
    MAX_RESULTS_PER_PAGE: 10,
    DEFAULT_PAGE_SIZE: 10,
  },
  PAGINATION: {
    DEFAULT_PAGE_OFFSET: 1,
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_ORDER_BY: 'imdbID',
    DEFAULT_SORT_DIRECTION: 'ascending',
  },
  VALIDATION: {
    ORDER_BY_OPTIONS: ['Title', 'Year', 'imdbID', 'Type'],
    SORT_DIRECTION_OPTIONS: ['ascending', 'descending'],
    TYPE_OPTIONS: ['movie', 'series', 'episode'],
  },
} as const;
