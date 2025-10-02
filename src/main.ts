import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors(appConfig.cors);

  const port = appConfig.port;

  try {
    await app.listen(port);
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
