export class AuthModel {
  token: string;
  refreshToken: string;
  expiration: Date;
  fullName : string

  setAuth(auth: any) {
    this.token = auth.token;
    this.refreshToken = auth.refreshToken;
    this.expiration = auth.expiration;
    this.fullName = auth.fullName;
  }
}
