import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminConfigs } from 'src/app/_metronic/configs/admin.config';
import { environment } from 'src/environments/environment';

interface itemRes {
    ActionName: string;
}

@Injectable({
    providedIn: 'root',
})
export class ChartsService {
    API_URL = `${environment.apiUrl}`;
    httpOptions = {
        headers: new HttpHeaders({
            'accept': '*/*',
            'Content-Type': 'multipart/form-data',
        }),
    };
    constructor(private http: HttpClient,private router: Router)
     {
        //cookieService = inject(CookieService);
     }
    getChartQuickInfo():Observable<any>{
        const formData = new FormData();
        formData.append('ActionName', 'QuickInfo');
        return this.http.post<any>(`${this.API_URL}${AdminConfigs.urls.getChartQuickInfo}`,formData).pipe(
            catchError(err => {
              this.handleAuthError(err);
              console.error('ITEM', err);
              return of();
            })
          );
    }
    handleAuthError(err: HttpErrorResponse): Observable<any> {
        //handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            //navigate /delete cookies or whatever
            this.router.navigateByUrl(`/auth/login`);
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            return of(err.message); // or EMPTY may be appropriate here
        }
        return throwError(err);
      }
}