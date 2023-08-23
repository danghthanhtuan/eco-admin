import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Categories } from "../_models/categories.model";
import { Slide } from "../_models/slides.model";
import { baseFilter } from "src/app/_fake/fake-helpers/http-extenstions";

@Injectable({
    providedIn: 'root'
  })
  export class SlidesService extends TableService<Slide> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
//   find(tableState: ITableState): Observable<TableResponseModel<Slide>> {
//     var cateParent = tableState.filter['categoryParent'] ?? '0';
//     var nameSearch = tableState.searchTerm ?? '';
//     var page = tableState.paginator.page ?? 1;
//     var pageSize = tableState.paginator.pageSize ?? 10; 
//     var querys = '?CategoryParent=' + cateParent + '&CategoryName=' + nameSearch + '&Page=' + page + '&PageSize=' + pageSize;
//     return this.http.get<any>(this.API_URL + '/v1/category/paging' + querys).pipe(
//       mergeMap((response: any) => {
//         var res :  Slide[] = response.data;
//         //const filteredResult = baseFilter(res, tableState);
//         const result: TableResponseModel<Slide> = {
//           items: response?.data?.data ?? [],
//           total:  response?.data?.total ?? 0
//         };
//         return of<TableResponseModel<Slide>>(<TableResponseModel<Slide>> result);
//       })
//     );
//   }

  find(tableState: ITableState): Observable<TableResponseModel<Slide>> {
    return this.http.get<any>(this.API_URL + '/v1/slides/limit?limit=100').pipe(
      mergeMap((response: any) => {
        var res :  Slide[] = response.data
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<Slide> = {
          items: res,
          total: res.length
        };
        return of<TableResponseModel<Slide>>(<TableResponseModel<Slide>> result);
      })
    );
  }

//   getAllCategory(): Observable<any> {
//     return this.http.get<any>(this.API_URL + '/v1/category/all/parent').pipe(
//       mergeMap((response: any) => {
//         return of<any>(<any> response.data);
//       })
//     );
//   }

}
  