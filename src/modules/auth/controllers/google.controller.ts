import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from '../services';
import type { IGoogleUser, IRequestWithUser } from 'src/common/types';
import { GoogleAuthGuard } from '../guards';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly service: GoogleAuthService) {}

  @Get()
  redirectToGoogle() {
    return this.service.redirectToGoogle();
  }

  @Get('callback')
  @UseGuards(GoogleAuthGuard)
  handleGoogleCallback(@Req() req: IRequestWithUser<IGoogleUser>) {
    return this.service.handleGoogleCallback(req.user);
  }
}
