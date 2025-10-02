# Movie API - NestJS Backend

A professional REST API for movie search built with NestJS, TypeScript, and OMDb integration.

## Overview

This backend provides a clean REST API that supports movie search functionality using the OMDb API. The application follows NestJS best practices with modular architecture, proper validation, and comprehensive error handling.

## Features

- **Movie Search**: Search movies with pagination, sorting, and filtering
- **Movie Details**: Get detailed information for specific movies
- **Health Monitoring**: Built-in health check endpoint
- **CORS Support**: Configured for frontend integration
- **Input Validation**: Request validation using class-validator
- **Error Handling**: Comprehensive error handling and logging

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **HTTP Client**: Axios (@nestjs/axios)
- **Validation**: class-validator, class-transformer
- **Package Manager**: pnpm

## API Endpoints

### Movies

- `GET /movies/search` - Search movies with pagination and sorting
  - Query parameters: `query`, `page_offset`, `page_size`, `order_by`, `sort_direction`, `type`, `year`
- `GET /movies/:imdbID` - Get detailed movie information

### Health

- `GET /health` - Application health check

## Prerequisites

- Node.js 18+
- pnpm package manager
- OMDb API key

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   PORT=4000
   OMDB_API_KEY=your_omdb_api_key_here
   ```

## Running the Application

### Development

```bash
pnpm run start:dev
```

### Production

```bash
pnpm run build
pnpm run start:prod
```

### Clean Start (kills existing processes)

```bash
pnpm run start:clean
```

## Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## Project Structure

```
src/
├── config/                    # Application configuration
│   └── app.config.ts         # Main app configuration
├── modules/                   # Feature modules
│   ├── movies/              # Movies module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── movies.controller.ts
│   │   ├── movies.service.ts
│   │   └── movies.module.ts
│   ├── favorites/           # Favorites module
│   └── health/              # Health check module
├── shared/                   # Shared utilities
│   ├── services/            # Shared services
│   └── constants/           # Application constants
├── app.controller.ts        # Root controller
├── app.service.ts          # Root service
├── app.module.ts          # Root module
└── main.ts               # Application entry point
```

## Configuration

### Environment Variables

- `PORT` - Server port (default: 4000)
- `OMDB_API_KEY` - OMDb API key (required)

### OMDb API Integration

The application integrates with the OMDb API for movie data. You need to:

1. Get a free API key from [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. Set the `OMDB_API_KEY` environment variable
3. The API will return appropriate error messages if the key is not configured

## API Usage Examples

### Search Movies

```bash
curl "http://localhost:4000/movies/search?query=batman&page_offset=1&page_size=10"
```

### Get Movie Details

```bash
curl "http://localhost:4000/movies/tt0372784"
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors)
- `404` - Not Found (movie not found)
- `500` - Internal Server Error (OMDb API issues)

## Development Notes

- Favorites are stored in-memory and reset on application restart
- The OMDb API has a limit of 10 results per page, but the API aggregates multiple pages to support larger page sizes
- All requests are validated using DTOs with class-validator
- CORS is enabled for frontend integration on localhost:3000

## License

MIT
