import { Inject, Injectable } from "@angular/core";
import { Product } from "../_models/product.model";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { Attribute } from "../_models/attribute.model";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
  export class AttributesService extends TableService<Attribute> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<Attribute>> {
    return this.http.get<any>(this.API_URL + '/v1/attribute/all').pipe(
      mergeMap((response: any) => {
        var res :  Attribute[] = response.data
        const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<Attribute> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return of<TableResponseModel<Attribute>>(<TableResponseModel<Attribute>> result);
      })
    );
  }

  
}
  