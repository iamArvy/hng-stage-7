import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google.service';
import { AuthGuard } from '@nestjs/passport';
import type { IGoogleUser, IRequestWithUser } from 'src/common/types';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly service: GoogleAuthService) {}

  @Get()
  redirectToGoogle() {
    return this.service.redirectToGoogle();
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  handleGoogleCallback(@Req() req: IRequestWithUser<IGoogleUser>) {
    return this.service.handleGoogleCallback(req.user);
  }
}
