import { Inject, Injectable } from "@angular/core";
import { Product } from "../_models/product.model";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { Attribute, AttributeValue } from "../_models/attribute.model";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
  export class AttributeValueService extends TableService<AttributeValue> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<AttributeValue>> {
    var attribute = tableState.filter['attribute'] ?? '0';
    var nameSearch = tableState.searchTerm ?? '';
    var page = tableState.paginator.page ?? 1;
    var pageSize = tableState.paginator.pageSize ?? 10; 
    var querys = '?AttributeID=' + attribute + '&Name=' + nameSearch + '&Page=' + page + '&PageSize=' + pageSize;
    return this.http.get<any>(this.API_URL + '/v1/attribute/value/paging' + querys).pipe(
      mergeMap((response: any) => {
        var res :  AttributeValue[] = response.data;
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<AttributeValue> = {
          items: response?.data?.data ?? [],
          total:  response?.data?.total ?? 0
        };
        return of<TableResponseModel<AttributeValue>>(<TableResponseModel<AttributeValue>> result);
      })
    );
  }

  getAllAttribute(): Observable<any> {
    return this.http.get<any>(this.API_URL + '/v1/attribute/all').pipe(
      mergeMap((response: any) => {
        return of<any>(<any> response.data);
      })
    );
  }

}
  