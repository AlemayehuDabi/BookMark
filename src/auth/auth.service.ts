import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    const hashed = await argon.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hashedPassword: hashed,
      },
    });

    if (!user) throw new Error('User not found');

    // remove hashedPassword safely
    const { hashedPassword, ...safeUser } = user;

    return safeUser;
  }

  signin(dto: AuthDto) {
    return 'this is sign in api';
  }
}
