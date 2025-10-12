import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup() {
    return 'this is sign up api';
  }
  @Post('signin')
  signin() {
    return 'this is sign in api';
  }
}
