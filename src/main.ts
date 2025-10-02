import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 4000;

  try {
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
    console.log(`🌐 CORS enabled for frontend: http://localhost:3000`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(
        `❌ Port ${port} is already in use. Please kill the process using this port.`,
      );
      console.error(`💡 Run: lsof -ti:${port} | xargs kill -9`);
      process.exit(1);
    }
    throw error;
  }
}
bootstrap();
