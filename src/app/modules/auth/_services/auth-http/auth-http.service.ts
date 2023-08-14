import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';
import { LoginModel } from '../../_models/login.model';
import { stringify } from 'querystring';

const API_USERS_URL = `${environment.apiUrl}/auth`;
const API_Login_URL = `${environment.apiUrl}/Authenticate/login`;
const API_Get_ByToken = `${environment.apiUrl}/Authenticate/get-user-by-token`;
const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type',
}

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  login(email: string, password: string): Observable<any> {

    var modelLogin = new LoginModel();
    modelLogin.username = email;
    modelLogin.password = password;
    return this.http.post<AuthModel>(`${API_Login_URL}`, JSON.stringify(modelLogin),  {
      headers: headerDict,
    });
    ;
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token): Observable<UserModel> {
    // const httpHeaders = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });
    return this.http.post<UserModel>(API_Get_ByToken +'?token=' + token, {
      headers: headerDict,
    });
  }
}
