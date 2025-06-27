import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Tidy List API')
    .setDescription(
      `Tidy List is a RESTful API developed as part of my personal portfolio to showcase my skills in backend development.

This API allows users to manage personal task lists and categories. It is fully documented with Swagger, secured with JWT authentication, and includes unit testing to ensure reliability and maintainability.

Built with:
- NestJS (TypeScript)
- PostgreSQL
- Prisma ORM
- Swagger for API documentation
- Unit testing with Jest

This project is open-source and publicly available for review.

[GitHub Repository](https://github.com/samuelengineerdev/tidy-list/tree/main/backend)  
[My Portfolio](https://www.samuelengineer.dev)
`
    )
    .setVersion('1.0')
    .addTag('Tidy List')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt',
    )
    .build();


  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
