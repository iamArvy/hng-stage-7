import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';
import { TokenData } from '.';

export class AuthResponse {
  user: UserResponseDto;
  access: TokenData;
}
