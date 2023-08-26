import { Inject, Injectable } from '@angular/core';
import { BaseModel, ITableState, TableResponseModel, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Product, ProductUpdate } from '../_models/product.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, empty, of, throwError } from 'rxjs';
import { ObjectModel } from '../_models/PagesObj.Model';
import { AdminConfigs } from 'src/app/_metronic/configs/admin.config';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/_services/auth.service';
const EMPTY_PRODUCT: Product = {
  id: 0,
  productCode: "String",
  productName: "String",
  categoryId: 0,
  description: "String",
  partnerID: 0,
  isNew: 0,
  isHot: 0,
  viewCount: 0,
  content: "String",
  price: 0,
  promotionPrice: 0,
  video: "String",
  status: 0,
  seoAlias: "String",
  seoKeyword: "String",
  stock: 0,
  imageUrl: "String",
  rateDiscount: 0,
  guarantee: 0,
  productNameSlug: "String",
  seoDescription: "String",
  seoTitle: "String",
  countRate: 0,
  rate: 0,
  createdDate: "String",
  updatedDate: "String",
  updatedUser: "String",
  createdUser: "String"
};
@Injectable({
  providedIn: 'root'
})
export class ProductsService extends TableService<Product> {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
    super(http, router);
}
find(tableState: ITableState): Observable<TableResponseModel<Product>> {
    const categoryId = tableState.filter['CategoryId'] ?? '0';
    const nameSearch = tableState.searchTerm ?? "";
    const page = tableState.paginator.page ?? 1;
    const pageSize = tableState.paginator.pageSize ?? 10; 
    const params = `?CategoryId=${categoryId}&ProductName=${nameSearch}&Page=${page}&PageSize=${pageSize}`;
    return this.http.get<any>(`${this.API_URL}${AdminConfigs.urls.getListProduts}${params}`,this.httpOptions).pipe(
    mergeMap((response: any) => {
      var res : Product [] = response.data;
      console.log(res);
      const result: TableResponseModel<Product> = {
        items: response?.data?.data ?? [],
        total:  response?.data?.total ?? 0
      };
      return of<TableResponseModel<Product>>(<TableResponseModel<Product>> result);
    })
  );
}
// getItemById(id: number, endpoint: string): Observable<Product> {
//   const url = `${this.API_URL}${AdminConfigs.urls.getProductById}${id}`;
//   return this.http.get<Product>(url).pipe(
//     catchError(err => {
//       console.error('GET ITEM BY IT', id, err);
//       return of(EMPTY_PRODUCT);
//     })
//   );
// }
  getItemById(id: number, endpoint: string): Observable<Product> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}${AdminConfigs.urls.getProductById}${id}`;
    return this.http.get<Product>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of(EMPTY_PRODUCT);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  // UPDATE
  update(item: ProductUpdate, endpoint: string): Observable<any> {
    const url = `${this.API_URL}${AdminConfigs.urls.updateProduct}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    this.httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*'
      }),
    };
    debugger
    return this.http.put(url, JSON.stringify(item), this.httpOptions).pipe(
      catchError(err => {
        this.handleAuthError(err);
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
   // CREATE
  // server should return the object with ID
  create(item: Product, endpoint: string): Observable<Product> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<Product>(`${this.API_URL}${AdminConfigs.urls.createProduct}`, JSON.stringify(item), this.httpOptions).pipe(
      catchError(err => {
        this.handleAuthError(err);
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of(EMPTY_PRODUCT);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }
  handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
        //navigate /delete cookies or whatever
        this.router.navigateByUrl(`/auth/login`);
        // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
        return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }
}
