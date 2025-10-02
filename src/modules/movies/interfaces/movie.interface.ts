export interface OMDbSearchResponse {
  Search: OMDbMovie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface OMDbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDbMovieDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface PaginationInfo {
  page_offset: number;
  page_size: number;
  sort_order: Array<{
    order_by: string;
    sort_direction: string;
  }>;
}

export interface SearchResponse {
  Search: OMDbMovie[];
  totalResults: string;
  Response: string;
  Error?: string;
  pagination: PaginationInfo;
}
