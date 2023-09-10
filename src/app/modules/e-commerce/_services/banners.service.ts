import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Banners } from "../_models/banner.model";

@Injectable({
    providedIn: 'root'
  })
  export class BannersService extends TableService<Banners> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<Banners>> {
    // var attribute = tableState.filter['attribute'] ?? '0';
    // var nameSearch = tableState.searchTerm ?? '';
    // var page = tableState.paginator.page ?? 1;
    // var pageSize = tableState.paginator.pageSize ?? 10; 
    // var querys = '?AttributeID=' + attribute + '&Name=' + nameSearch + '&Page=' + page + '&PageSize=' + pageSize;
    return this.http.get<any>(this.API_URL + '/v1/banners/limit?limit=100').pipe(
      mergeMap((response: any) => {
        var res :  Banners[] = response.data;
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<Banners> = {
          items: res,
          total: res.length
        };
        return of<TableResponseModel<Banners>>(<TableResponseModel<Banners>> result);
      })
    );
  }
}
  