import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Omni Search API')
    .setDescription(
      'API de búsqueda avanzada de productos con motor de Elasticsearch, caché en Redis y Arquitectura Hexagonal.',
    )
    .setVersion('1.0')
    .addTag('Search', 'Endpoints para búsqueda de productos y autocompletado')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicación corriendo en http://localhost:${port}`);
  console.log(`Documentación Swagger en http://localhost:${port}/api/docs`);
}
bootstrap();
