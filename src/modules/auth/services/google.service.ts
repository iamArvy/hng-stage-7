import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import qs from 'qs';
import { IGoogleUser } from 'src/common/types';
import { AuthProvider } from 'src/generated/prisma/enums';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';
import { UserModelAction } from 'src/modules/user/model-actions/user.model-action';
import { TokenService } from './token.service';

@Injectable()
export class GoogleAuthService {
  private googleOauthURL = 'https://accounts.google.com/o/oauth2/v2/auth';

  private clientId: string;
  private redirectUri: string;

  constructor(
    config: ConfigService,
    private readonly userModelAction: UserModelAction,
    private readonly token: TokenService,
  ) {
    this.clientId = config.get('GOOGLE_CLIENT_ID') || '';
    this.redirectUri = config.get('app.url') + '/auth/google/callback';
  }
  redirectToGoogle() {
    const url =
      this.googleOauthURL +
      '?' +
      qs.stringify({
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        response_type: 'code',
        scope: ['openid', 'email', 'profile'].join(' '),
        access_type: 'offline',
        prompt: 'consent',
      });

    return { google_auth_url: url };
  }

  async handleGoogleCallback(gUser: IGoogleUser) {
    if (!gUser) {
      throw new BadRequestException('Google authentication failed');
    }

    const user = await this.userModelAction.findOrCreate(
      { google_id: gUser.sub },
      {
        provider: AuthProvider.GOOGLE,
        google_id: gUser.sub,
        email: gUser.email,
        first_name: gUser.given_name,
        last_name: gUser.family_name,
        profile_picture: gUser.picture,
      },
      {
        email: gUser.email,
        first_name: gUser.given_name,
        last_name: gUser.family_name,
        profile_picture: gUser.picture,
      },
    );
    const access = await this.token.access(user.id, user.email);
    return {
      user: new UserResponseDto(user),
      access,
    };
  }
}
