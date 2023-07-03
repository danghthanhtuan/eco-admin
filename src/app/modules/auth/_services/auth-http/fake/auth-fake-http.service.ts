import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserModel } from '../../../_models/user.model';
import { AuthModel } from '../../../_models/auth.model';
import { UsersTable } from '../../../../../_fake/fake-db/users.table';
import { environment } from '../../../../../../environments/environment';
import { LoginModel, LoginModelResult } from '../../../_models/login.model';

const API_USERS_URL = `${environment.apiUrl}/Authenticate/login`;
const API_Login_URL = `${environment.apiUrl}/Authenticate/login`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }
    var modelLogin = new LoginModel();
    modelLogin.username = email;
    modelLogin.password = password;

    return this.callLogin(modelLogin).pipe(
      map((result: any) => {
        if (result == null || result.statusCode != 200 || result.data == null) {
          return notFoundError;
        }

        // const user = result.find((u) => {
        //   return (
        //     u.email.toLowerCase() === email.toLowerCase() &&
        //     u.password === password
        //   );
        // });
        // if (!user) {
        //   return notFoundError;
        // }

        const auth = new AuthModel();
        auth.authToken = result.data.token;
        auth.refreshToken = result.data.refreshToken;
        auth.expiresIn = result.data.expiration;
        return auth;
      })
    );
  }

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.authToken = 'auth-token-' + Math.random();
    user.refreshToken = 'auth-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/users/default.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }

  getUserByToken(token: string): Observable<UserModel> {
    const user = UsersTable.users.find((u) => {
      return u.authToken === token;
    });

    if (!user) {
      return of(new UserModel);
    }

    return of(user);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }

  callLogin(_LoginModel : any): Observable<any> {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    return this.http.post<any>(API_Login_URL,JSON.stringify(_LoginModel), {
      headers: headerDict
    });
  }
}
