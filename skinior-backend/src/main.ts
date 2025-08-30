import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3007',
      'https://skinior.com',
      'https://www.skinior.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Set global prefix for all routes
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT ?? 4008);
}
bootstrap();
