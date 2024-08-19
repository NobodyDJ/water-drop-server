import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // 若传参为空，则允许跨域
  await app.listen(3000);
}
bootstrap();
