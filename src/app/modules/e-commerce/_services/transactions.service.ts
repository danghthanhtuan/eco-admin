import { Inject, Injectable } from "@angular/core";
import { ITableState, TableResponseModel, TableService } from "src/app/_metronic/shared/crud-table";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { baseFilter } from '../../../_fake/fake-helpers/http-extenstions';
import { exhaustMap, map, mergeMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { TransactionModel } from "../_models/transaction.model";

@Injectable({
    providedIn: 'root'
  })
  export class TransactionsService extends TableService<TransactionModel> {
    API_URL = `${environment.apiUrl}`;
    constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
      super(http, router);
    }

     // READ
  find(tableState: ITableState): Observable<TableResponseModel<TransactionModel>> {
    debugger;
    var status = tableState.filter['status'] ?? '0';
    var nameSearch = tableState.searchTerm ?? '';
    var searchPhone = tableState.filter['searchPhone'] ?? '';
    var searchOrderCode = tableState.filter['searchOrderCode'] ?? '';
    var page = tableState.paginator.page ?? 1;
    var pageSize = tableState.paginator.pageSize ?? 10; 
    var querys = '?Status=' + status + '&SearchKey=' + nameSearch + '&SearchPhone=' + searchPhone + '&searchOrderCode=' + searchOrderCode + '&Page=' + page + '&PageSize=' + pageSize;
    return this.http.get<any>(this.API_URL + '/v1/payment/admin/paging' + querys).pipe(
      mergeMap((response: any) => {
        var res :  TransactionModel[] = response.data;
        //const filteredResult = baseFilter(res, tableState);
        const result: TableResponseModel<TransactionModel> = {
          items: response?.data?.data ?? [],
          total:  response?.data?.total ?? 0
        };
        return of<TableResponseModel<TransactionModel>>(<TableResponseModel<TransactionModel>> result);
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
  