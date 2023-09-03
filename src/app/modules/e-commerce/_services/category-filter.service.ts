import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Categories } from "../_models/categories.model";

@Injectable({
    providedIn: 'root'
  })
  export class CategoryFilterService extends TableService<Categories> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }
    httpOptionsFormData = {
      headers: new HttpHeaders({
          //'Content-Type': 'multipart/form-data',
          //'Accept': '*/*',
         // 'Access-Control-Allow-Headers': 'Content-Type',
          'Authorization' : 'Bearer ' + this.getToken()
      }),
    };

    getToken(){
      var token = '';
      if(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`)){
        var auth: any = JSON.parse(localStorage.getItem(`${environment.appVersion}-${environment.USERDATA_KEY}`));
        token = auth.token;
      }
      return token;
    }
     // READ
  find(tableState: ITableState): Observable<TableResponseModel<Categories>> {
    // var cateParent = tableState.filter['categoryParent'] ?? '0';
    // var nameSearch = tableState.searchTerm ?? '';
    // var page = tableState.paginator.page ?? 1;
    // var pageSize = tableState.paginator.pageSize ?? 10;
    // var querys = '?CategoryParent=' + cateParent + '&CategoryName=' + nameSearch + '&Page=' + page + '&PageSize=' + pageSize;
    return this.http.get<any>(this.API_URL + '/v1/filters/all-category-filter', this.httpOptionsFormData).pipe(
      mergeMap((response: any) => {
        var res :  Categories[] = response.data;
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<Categories> = {
          items:res,
          total:  res.length
        };
        return of<TableResponseModel<Categories>>(<TableResponseModel<Categories>> result);
      })
    );
  }


  getCategoryCategprFilterValueByCategoyId(id: Number): Observable<any> {
    return this.http.get<any>(this.API_URL + '/v1/filters/category-filter-value-use?caategoryId=' + id).pipe(
      mergeMap((response: any) => {
        return of<any>(<any> response.data);
      })
    );
  }

}
