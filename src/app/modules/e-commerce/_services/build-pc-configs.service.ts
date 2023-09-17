import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Banners } from "../_models/banner.model";
import { BuildPC } from "../_models/build-pc.model";

@Injectable({
    providedIn: 'root'
  })
  export class BuildPcConfigsService extends TableService<BuildPC> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<BuildPC>> {
    // var attribute = tableState.filter['attribute'] ?? '0';
    // var nameSearch = tableState.searchTerm ?? '';
    // var page = tableState.paginator.page ?? 1;
    // var pageSize = tableState.paginator.pageSize ?? 10; 
    // var querys = '?AttributeID=' + attribute + '&Name=' + nameSearch + '&Page=' + page + '&PageSize=' + pageSize;
    return this.http.get<any>(this.API_URL + '/v1/buildpc/all').pipe(
      mergeMap((response: any) => {
        var res :  BuildPC[] = response.data;
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<BuildPC> = {
          items: res,
          total: res.length
        };
        return of<TableResponseModel<BuildPC>>(<TableResponseModel<BuildPC>> result);
      })
    );
  }
}
  