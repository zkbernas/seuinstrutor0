import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // DEVE SER A MESMA DO AUTH MODULE
      secretOrKey: process.env.JWT_SECRET || 'SEU_INSTRUTOR_JWT_SECRET_KEY_2024_SUPER_SECURE',
    });
  }

  async validate(payload: any) {
    // Verifique se o seu payload do login realmente envia a 'role'
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}