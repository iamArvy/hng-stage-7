import { Module } from '@nestjs/common';
import { GoogleAuthController, GoogleAuthService } from './google';

@Module({
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class AuthModule {}
