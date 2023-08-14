import { Inject, Injectable } from "@angular/core";
import { Product } from "../_models/product.model";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { Attribute } from "../_models/attribute.model";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { exhaustMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class AttributesService extends TableService<Attribute> {
    API_URL = `${environment.apiUrl}/v1/attribute/all`;
    constructor(@Inject(HttpClient) http) {
      super(http);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<Attribute>> {
    return this.http.get<Attribute[]>(this.API_URL).pipe(
      map((response: any) => {

        var res :  Attribute[] = response.data
        debugger;

        const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<Attribute> = {
          items: filteredResult.items,
          total: filteredResult.total
        };
        return result;
      })
    );
  }

  
}
  