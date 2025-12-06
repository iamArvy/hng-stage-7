import { Module } from '@nestjs/common';
import { GoogleAuthController, GoogleAuthService } from './google';
import { GoogleStrategy } from './google/google.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleStrategy],
})
export class AuthModule {}
