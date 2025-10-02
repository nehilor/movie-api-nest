export const appConfig = {
  port: process.env.PORT || 4000,
  omdb: {
    apiKey: process.env.OMDB_API_KEY || 'demo',
    baseUrl: 'http://www.omdbapi.com',
  },
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
} as const;
