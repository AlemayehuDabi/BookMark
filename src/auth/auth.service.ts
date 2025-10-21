import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // sign up function
  async signup(dto: AuthDto) {
    const hashed = await argon.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashed,
        },
      });

      if (!user) throw new Error('User not found');

      return await this.sign_jwt(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exist');
        }
      }
      throw error;
    }
  }

  // sign in function
  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new ForbiddenException('Credentials incorrect');

      const matched = await argon.verify(user.hashedPassword, dto.password);

      if (!matched) throw new ForbiddenException('Credentials incorrect');

      return await this.sign_jwt(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }

  // sign_jwt(access token and refresh token)
  async sign_jwt(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    // token
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    // save refresh token in db
    await this.prisma.user.update({
      where: { email },
      data: { refreshToken: await argon.hash(refreshToken) },
    });

    return { accessToken, refreshToken };
  }

  // access token based on refresh token
  async generate_access_token(
    refreshToken: string,
    UserId: string,
    email: string,
  ) {
    const payload = {
      sub: UserId,
      email,
    };
    const accessToken = this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    return { accessToken };
  }
}
