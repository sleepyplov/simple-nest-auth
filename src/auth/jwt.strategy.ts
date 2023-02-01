import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { resolve } from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: readFileSync(
        resolve(configService.get('JWT_KEYS_PATH'), 'public.pem'),
      ),
      algorithms: ['RS256'],
      audience: configService.get('JWT_AUDIENCE'),
      issuer: configService.get('JWT_ISSUER'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { userID: payload.sub };
  }
}
