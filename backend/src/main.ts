import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow your frontend to communicate with the backend
  app.enableCors({
    origin: 'http://localhost:5173', // specifically allow your Vite frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // required if you are passing cookies or authorization headers
  });

  await app.listen(3000);
}
bootstrap();