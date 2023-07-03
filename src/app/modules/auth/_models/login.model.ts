export class LoginModel {
    username: string;
    password: string;
    expiresIn: Date;
  
    setAuth(login: any) {
      this.username = login.username;
      this.password = login.password;
    }
  }
  

  export class LoginModelResult {
    data : Object = {
        token : "",
        refreshToken : "",
        expiration : null
    }
}