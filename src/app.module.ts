import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SecurityModule } from './security/security.module';
import * as Joi from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('production'),
        LISTEN_HOST: Joi.string().hostname().default('0.0.0.0'),
        LISTEN_PORT: Joi.number().port().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_KEYS_PATH: Joi.string().required(),
        // number or string in vercel/ms format
        JWT_EXPIRE: Joi.alternatives(Joi.string(), Joi.number).default('15m'),
        JWT_AUDIENCE: Joi.string().required(),
        JWT_ISSUER: Joi.string().required(),
      }),
    }),
    UsersModule,
    AuthModule,
    SecurityModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
