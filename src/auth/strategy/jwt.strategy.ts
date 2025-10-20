import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_ACCESS_SECRET')!,
    });
  }

  // 👇 REQUIRED METHOD for Passport to validate the token payload
  async validate(payload: { sub: number; email: string }) {
    // payload is the JWT data (decoded)
    // Here you can attach data to the request object
    return { userId: payload.sub, email: payload.email };
  }
}
