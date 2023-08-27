import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { Product, ProductUpdate } from '../../_models/product.model';
import { ProductsService } from '../../_services/products.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { AddProductAttributeModalComponent } from './product-attribute/add-product-attribute-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AttributeValueService } from '../../_services/attribute-value.service';

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
  createdUser: "",
  productTags: "",
  productAttributes : [] 
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
  categories : any;
  listAttributeValues  : any;
  config: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '50',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: false,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    // upload: (file: File) => { ... }
    //uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute,
    private srvAlter: SwalService,
    private modalService: NgbModal,
    private attributeValueService :AttributeValueService
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.productsService.isLoading$;
    this.getAllCategory();
    this.getListAttribute();
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
      productCode:[this.product.productCode, Validators.required],
      productName:[this.product.productName,  Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(500)])],
      seoTitle:[this.product.seoTitle, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      productTags:[this.product.productTags],
      categoryId:[this.product.categoryId],
      isNew:[this.product.isNew],
      isHot:[this.product.isHot],
      //viewCount:[this.product.viewCount],
      content:[this.product.content],
      price: [this.product.price],
      promotionPrice: [this.product.promotionPrice],
      //video: [this.product.video],
      status: [this.product.status],
      //seoAlias: [this.product.seoAlias],
      seoKeyword: [this.product.seoKeyword],
      seoDescription: [this.product.seoDescription],
      stock: [this.product.stock],
      //rateDiscount: [this.product.rateDiscount],
      //countRate: [this.product.countRate],
      guarantee: [this.product.guarantee],
      //productNameSlug: [this.product.productNameSlug],
      description: [this.product.description],
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
    if (!this.formGroup.valid) {
      this.validateAllFormFields(this.formGroup);
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
   var attributeValueIds: number[] = this.product.productAttributes?.map(({ attributeValueID }) => attributeValueID);
    const proUp : ProductUpdate = {
      ProductId : this.id,
      ProductCode : this.product.productCode,
      ProductName : this.product.productName,
      CategoryId  : this.product.categoryId,
      Description : this.product.description,
      IsNew : this.product.partnerID,
      IsHot : this.product.isHot,
      Content : this.product.content,
      Price : this.product.price,
      PromotionPrice  : this.product.promotionPrice,
      Video : this.product.video,
      Stock : this.product.stock,
      AttributeValueIds: attributeValueIds,
      Status : this.product.status,
      guarantee : this.product.guarantee,
      SeoDescription: this.product.seoDescription,
      SeoKeyword :   this.product.seoKeyword,
      SeoTitle : this.product.seoTitle,
      ProductTags :  this.product.productTags.toString(),
      id:0
    };
    const sbUpdate = this.productsService.update(proUp, '').pipe(
      tap((res: any) =>
      {
        this.checkSuccessEditOrAdd(res, "Cập nhật");      
      }   
       ),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(this.product);
      })
    ).subscribe(res => {
      // debugger;
      // this.loadProduct();
    });
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

  getCategoryName(id : number){
    var cate = this.categories.find(cate => cate.id === id);
    if(cate){
     return cate.categoryName;
    }
    return "";
   }

  getAllCategory(){
    this.productsService.getAllCategories()
    .subscribe(
      (res: any) => {
        this.categories = res;
      }
    )
    //.subscribe();
  }

  removeItemAtt(attValueId : number){
    this.product.productAttributes?.forEach((item :any , index)=>{
      if(item.attributeValueID == attValueId) this.product.productAttributes.splice(index, 1);
  });
  }

  addProductAttribute() {
    const modalRef = this.modalService.open(AddProductAttributeModalComponent, {size: 'lg'});
    modalRef.componentInstance.listAttributes = this.listAttributeValues;
    modalRef.componentInstance.add.subscribe(($value) => {
     var item = this.product.productAttributes?.find((item :any , index)=>{
        if(item.attributeValueID == $value) return item;
      });

      if(!item){
        var itemSelected = this.listAttributeValues.find((item :any , index)=>{
          if(item.id == $value) return item;
        });
        var itemAdd = {
          attributeValueID : itemSelected.id,
          attributeValueName : itemSelected.name,
          attributeName : itemSelected.attributeName,
        }

        this.product.productAttributes.push(itemAdd);
        this.srvAlter.toast(TYPE.SUCCESS, "Thêm thành công!", false);
      } 
    })
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }
  

  getListAttribute(){
    this.attributeValueService.getAllAttributeValue()
    .subscribe(
      (res: any) => {
        this.listAttributeValues = res;
      }
    )
    //.subscribe();
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

  checkSuccessEditOrAdd(res: any, action : string){
    if(res && res.statusCode === 200 && res.errorCode == 0){
      this.srvAlter.toast(TYPE.SUCCESS, action + " thành công!", false);

    }else{
      this.srvAlter.toast(TYPE.ERROR, action + " không thành công!", false);
    }
  };
}
