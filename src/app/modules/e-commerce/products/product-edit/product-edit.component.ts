import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Product, ProductUpdate } from '../../_models/product.model';
import { ProductsService } from '../../_services/products.service';

const EMPTY_PRODUCT: Product = {
  id: 0,
  productCode: "",
  productName: "",
  categoryId: 0,
  description: "",
  partnerID: 0,
  isNew: 0,
  isHot: 0,
  viewCount: 0,
  content: "",
  price: 0,
  promotionPrice: 0,
  video: "",
  status: 0,
  seoAlias: "",
  seoKeyword: "",
  stock: 0,
  imageUrl: "",
  rateDiscount: 0,
  guarantee: 0,
  productNameSlug: "",
  seoDescription: "",
  seoTitle: "",
  countRate: 0,
  rate: 0,
  createdDate: "",
  updatedDate: "",
  updatedUser: "",
  createdUser: ""
};

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  id: number;
  product: Product;
  previous: Product;
  formGroup: FormGroup;
  isLoading$: Observable<boolean>;
  errorMessage = '';
  tabs = {
    BASIC_TAB: 0,
    REMARKS_TAB: 1,
    SPECIFICATIONS_TAB: 2
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications
  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productsService.isLoading$;
    this.loadProduct();
  }

  loadProduct() {
    const sb = this.route.paramMap.pipe(
      switchMap(params => {
        // get id from URL
        this.id = Number(params.get('id'));
        if (this.id || this.id > 0) {
          return this.productsService.getItemById(this.id, '');
        }
        return of(EMPTY_PRODUCT);
      }),
      catchError((errorMessage) => {
        this.errorMessage = errorMessage;
        return of(undefined);
      }),
    ).subscribe((res: any) => {
      if (!res) {
        this.router.navigate(['/products'], { relativeTo: this.route });
      }
      this.product = res.data ?? EMPTY_PRODUCT;
      this.previous = Object.assign({}, res);
      this.loadForm();
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    if (!this.product) {
      return;
    }
    this.formGroup = this.fb.group({
      // mileage: [this.product.stock, Validators.compose([
      //   Validators.required,
      //   Validators.minLength(1),
      //   Validators.min(0),
      //   Validators.maxLength(100),
      //   Validators.max(1000000)
      // ])],
      productCode:[this.product.productCode, Validators.required],
      productName:[this.product.productName, Validators.required],
      seoTitle:[this.product.seoTitle],
      partnerID:[this.product.partnerID],
      categoryId:[this.product.categoryId],
      isNew:[this.product.isNew],
      isHot:[this.product.isHot],
      viewCount:[this.product.viewCount],
      content:[this.product.content],
      price: [this.product.price],
      promotionPrice: [this.product.promotionPrice],
      video: [this.product.video],
      status: [this.product.status],
      seoAlias: [this.product.seoAlias],
      seoKeyword: [this.product.seoKeyword],
      seoDescription: [this.product.seoDescription],
      stock: [this.product.stock],
      rateDiscount: [this.product.rateDiscount],
      countRate: [this.product.countRate],
      guarantee: [this.product.guarantee],
      productNameSlug: [this.product.productNameSlug],
      description: [this.product.description],
      // VINCode: [this.product.productCode, Validators.required]
    });
  }

  reset() {
    if (!this.previous) {
      return;
    }

    this.product = Object.assign({}, this.previous);
    this.loadForm();
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    const formValues = this.formGroup.value;
    this.product = Object.assign(this.product, formValues);
    if (this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const proUp : ProductUpdate = {
      ProductId : this.product.id,
      ProductCode : this.product.productCode,
      ProductName : this.product.productName,
      CategoryId  : this.product.categoryId,
      Description : this.product.description,
      PartnerID : this.product.partnerID,
      IsNew : this.product.partnerID,
      IsHot : this.product.isHot,
      Content : this.product.content,
      Price : this.product.price,
      PromotionPrice  : this.product.promotionPrice,
      Video : this.product.video,
      Images : this.product.productImages,
      Stock : this.product.stock,
      AttributeValueIds:this.product.productAttributes,
      Status : this.product.status,
      id:0
    };
    const sbUpdate = this.productsService.update(proUp, '').pipe(
      tap(() => this.router.navigate(['/ecommerce/products'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.product);
      })
    ).subscribe(res => this.product = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.productsService.create(this.product, '').pipe(
      tap(() => this.router.navigate(['/ecommerce/products'])),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.product);
      })
    ).subscribe(res => this.product = res as Product);
    this.subscriptions.push(sbCreate);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
