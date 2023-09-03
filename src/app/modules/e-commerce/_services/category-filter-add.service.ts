import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, exhaustMap, finalize, map, mergeMap, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { CategoryFilter } from "../_models/category-filter.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryFilterAddService extends TableService<CategoryFilter> {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http, @Inject(Router) router) {
    super(http, router);
  }
  httpOptionsFormData = {
    headers: new HttpHeaders({
      //'Content-Type': 'multipart/form-data',
      //'Accept': '*/*',
      // 'Access-Control-Allow-Headers': 'Content-Type',
      'Authorization': 'Bearer ' + this.getToken()
    }),
  };

  getToken() {
    var token = '';
    if (localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)) {
      var auth: any = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`));
      token = auth.token;
    }
    return token;
  }
  // READ
  find(tableState: ITableState): Observable<TableResponseModel<CategoryFilter>> {
   var id = tableState.entityId ?? '0';
    return this.http.get<any>(this.API_URL + '/v1/filters/category-filter-value-use?caategoryId=' + id, this.httpOptionsFormData).pipe(
      mergeMap((response: any) => {
        var res: CategoryFilter[] = response.data;
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<CategoryFilter> = {
          items: res,
          total: res.length
        };
        this.grouping.itemIds = res.map(({ filterValueID }) => filterValueID);
        this.grouping.selectedRowIds = new Set();
        res.forEach((item) => {
          if(item.isUse)
          {
            this.grouping.selectedRowIds.add(item.filterValueID);
          }
        });
      
        return of<TableResponseModel<CategoryFilter>>(<TableResponseModel<CategoryFilter>>result);
      })
    );
  }

  updateCategoryFilterValue(item: any, endpoint: string): Observable<any> {
    const url = `${this.API_URL}${endpoint}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post(url, JSON.stringify(item), this.httpOptions).pipe(
      catchError(err => {
        this.handleAuthError(err);
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getCategoryCategprFilterValueByCategoyId(id: Number): Observable<any> {
    return this.http.get<any>(this.API_URL + '/v1/filters/category-filter-value-use?caategoryId=' + id).pipe(
      mergeMap((response: any) => {
        return of<any>(<any>response.data);
      })
    );
  }

}
