import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para el frontend
  app.enableCors({
    origin: 'http://localhost:5173',  // URL del frontend (Vite)
    credentials: true,
  });
  
  // Habilitar validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Elimina propiedades no definidas en el DTO
    transform: true,  // Transforma tipos automáticamente
  }));
  
  await app.listen(8282);
  console.log('🚀 Servidor corriendo en http://localhost:8282');
}
bootstrap();