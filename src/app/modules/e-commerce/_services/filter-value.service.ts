import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { FilterValue } from "../_models/filter.model";

@Injectable({
    providedIn: 'root'
  })
  export class FilterValueService extends TableService<FilterValue> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<FilterValue>> {
    var filterId = tableState.filter['filterId'] ?? '0';
    var nameSearch = tableState.searchTerm ?? '';
    var page = tableState.paginator.page ?? 1;
    var pageSize = tableState.paginator.pageSize ?? 10; 
    var querys = '?FilterID=' + filterId + '&Name=' + nameSearch + '&Page=' + page + '&PageSize=' + pageSize;
    return this.http.get<any>(this.API_URL + '/v1/filters/value/paging' + querys).pipe(
      mergeMap((response: any) => {
        var res :  FilterValue[] = response.data;
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<FilterValue> = {
          items: response?.data?.data ?? [],
          total:  response?.data?.total ?? 0
        };
        return of<TableResponseModel<FilterValue>>(<TableResponseModel<FilterValue>> result);
      })
    );
  }

  getAllFiltres(): Observable<any> {
    return this.http.get<any>(this.API_URL + '/v1/filters/all').pipe(
      mergeMap((response: any) => {
        return of<any>(<any> response.data);
      })
    );
  }

}
  