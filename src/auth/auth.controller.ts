import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return 'this is sign up api';
  }
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return 'this is sign in api';
  }
}
