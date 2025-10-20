import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { JwtGuard } from 'src/auth/jwtGuard';

@Controller('users')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  getme(@Req() req: Request) {
    return req.user;
  }
}
