import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
      transform: true, // quan trọng để convert form-data thành đúng kiểu
    }
  ));
  app.use(cookieParser());

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('Blog Application APIs')
    .setDescription(
      ''
    )
    .setVersion('1.0')
    .addTag('Blogs')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 5000);
}
bootstrap().then();
