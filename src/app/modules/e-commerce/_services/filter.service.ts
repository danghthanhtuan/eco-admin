import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Filter } from "../_models/filter.model";
import { baseFilter } from "src/app/_fake/fake-helpers/http-extenstions";

@Injectable({
  providedIn: 'root'
})
export class FiltersService extends TableService<Filter> {
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
  find(tableState: ITableState): Observable<TableResponseModel<Filter>> {
    return this.http.get<any>(this.API_URL + '/v1/filters/all', this.httpOptionsFormData).pipe(
      mergeMap((response: any) => {
        var res: Filter[] = response.data
        const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<Filter> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return of<TableResponseModel<Filter>>(<TableResponseModel<Filter>>result);
      })
    );
  }
}
