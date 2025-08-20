import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add request logging middleware
  app.use((req: any, res: any, next: any) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress || 'Unknown';
    
    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    
    next();
  });

  // Configure CORS
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://localhost:3000',
        'http://localhost:3007',
        'http://localhost:4200',
        'https://localhost:3007',
        'https://skinior.com',
        'https://www.skinior.com',
      ];
      
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow explicit origins or any subdomain of skinior.com
      if (allowedOrigins.includes(origin) || origin.endsWith('.skinior.com') || origin === 'https://skinior.com') {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
    ],
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set global API prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 4008);
}
bootstrap();
