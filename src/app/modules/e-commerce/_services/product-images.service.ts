import { Inject, Injectable } from '@angular/core';
import { BaseModel, ITableState, TableResponseModel, TableService } from '../../../_metronic/shared/crud-table';
import { environment } from '../../../../environments/environment';
import { Product, ProductUpdate } from '../_models/product.model';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, empty, of, throwError } from 'rxjs';
// import { ObjectModel } from '../_models/PagesObj.Model';
import { AdminConfigs } from 'src/app/_metronic/configs/admin.config';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProductImage } from '../_models/product-image.model';
const EMPTY_PRODUCT_Images : any = {
  id: 0,
  imageUrl: "",
  sortOrder: 0,
};
@Injectable({
  providedIn: 'root'
})
export class ProductImagesService extends TableService<ProductImage> {
  API_URL = `${environment.apiUrl}`;
  constructor(@Inject(HttpClient) http, @Inject(Router) router ) {
    super(http, router);
}
find(tableState: ITableState): Observable<TableResponseModel<ProductImage>> {
    const productId = tableState.entityId ?? '0';
    return this.http.get<any>(`${this.API_URL}${AdminConfigs.urls.getImageByProductId}${productId}`,this.httpOptions).pipe(
    mergeMap((response: any) => {
      var res : ProductImage [] = response.data;
      console.log(res);
      const result: TableResponseModel<ProductImage> = {
        items: res,
        total:  res.length
      };
      return of<TableResponseModel<ProductImage>>(<TableResponseModel<ProductImage>> result);
    })
  );
}
  
  // UPDATE
  update(item: ProductUpdate, endpoint: string): Observable<any> {
    const url = `${this.API_URL}${AdminConfigs.urls.updateProduct}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
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
        return of(EMPTY_PRODUCT_Images);
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