import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Remplace par l'URL de ton frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization', // Tu peux ajouter d'autres headers si nécessaire
  });
  const appService = app.get(AppService);
  await appService.initializeCartsForExistingUser()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
