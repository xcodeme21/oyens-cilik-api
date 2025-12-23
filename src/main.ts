import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor, HttpExceptionFilter } from './common';

let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // Global prefix
    app.setGlobalPrefix(process.env.API_PREFIX || 'api');

    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    // Global response interceptor
    app.useGlobalInterceptors(new TransformInterceptor());

    // Global exception filter
    app.useGlobalFilters(new HttpExceptionFilter());

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Oyens Cilik API')
      .setDescription('Backend API untuk aplikasi belajar anak Oyens Cilik')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management endpoints')
      .addTag('content', 'Learning content endpoints')
      .addTag('progress', 'Progress tracking endpoints')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
  }
  return app;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🐱 Oyens Cilik API running on: http://localhost:${port}`);
      console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
    });
  });
}

// Export for Vercel
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};
