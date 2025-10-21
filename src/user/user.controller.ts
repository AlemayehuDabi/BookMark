import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/jwtGuard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getme(@GetUser() user: User) {
    return user;
  }
}
