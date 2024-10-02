import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { peerServer } from './peer-server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  peerServer(app);

  await app.listen(3000);
  console.log('NestJS application and PeerJS server are running on port 3000');
}

bootstrap();
