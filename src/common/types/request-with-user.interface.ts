export interface IGoogleUser {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
  email_verified: boolean;
}

export interface IRequestWithUser<T> {
  user: T;
}
