import { Controller, Get } from '@nestjs/common';
import { GoogleAuthService } from './google.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly service: GoogleAuthService) {}

  @Get()
  redirectToGoogle() {
    return this.service.redirectToGoogle();
  }

  @Get('callback')
  handleGoogleCallback() {
    return this.service.handleGoogleCallback();
  }
}
