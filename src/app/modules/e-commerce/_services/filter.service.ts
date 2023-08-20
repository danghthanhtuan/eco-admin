import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Filter } from "../_models/filter.model";

@Injectable({
    providedIn: 'root'
  })
  export class  FiltersService extends TableService<Filter> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<Filter>> {
    return this.http.get<any>(this.API_URL + '/v1/filters/all').pipe(
      mergeMap((response: any) => {
        var res :  Filter[] = response.data
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<Filter> = {
          items: res,
          total: res.length
        };
        return of<TableResponseModel<Filter>>(<TableResponseModel<Filter>> result);
      })
    );
  }
}
  