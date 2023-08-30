import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ITableState, TableResponseModel, TableService } from 'src/app/_metronic/shared/crud-table';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Review } from '../_models/review.model';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AdminConfigs } from 'src/app/_metronic/configs/admin.config';

@Injectable({
  providedIn: 'root'
})
export class RemarksService extends TableService<Review> {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http, @Inject(Router) router) {
    super(http, router);
  }

  find(tableState: ITableState): Observable<TableResponseModel<Review>> {
    debugger;
    const productId = tableState.entityId ?? '0';
    return this.http.get<any>(`${this.API_URL}${AdminConfigs.urls.getReviewPaging}${productId}`, this.httpOptions).pipe(
      mergeMap((response: any) => {
        var res: Review[] = response.data;
        console.log(res);
        const result: TableResponseModel<Review> = {
          items: res,
          total: res.length
        };
        return of<TableResponseModel<Review>>(<TableResponseModel<Review>>result);
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
