import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  const configService = app.get(ConfigService);
  await app.listen(
    configService.get('LISTEN_PORT'),
    configService.get('LISTEN_HOST'),
    (err, address) => {
      if (err) {
        console.error(err);
      }
      console.log(
        'Now we have one more happy Sleepy Plov! Listening on ' + address,
      );
    },
  );
}
bootstrap();
