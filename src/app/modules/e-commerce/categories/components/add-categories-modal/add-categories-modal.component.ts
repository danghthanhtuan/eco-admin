import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { AttributesService } from '../../../_services/attributes.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Attribute, AttributeValue } from '../../../_models/attribute.model';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { CommonModule } from '@angular/common';  
import { AttributeValueService } from '../../../_services/attribute-value.service';
import { Categories } from '../../../_models/categories.model';
import { CategoriesService } from '../../../_services/categories.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-categories-modal',
  templateUrl: './add-categories-modal.component.html',
  styleUrls: []
})
export class AddCategoriesModalComponent implements OnInit, OnDestroy {
  EMPTY_Attribute_Value : any = {
    id: undefined,
    categoryName : '',
    status: 0,
    categoryParent : 0,
    seoDescription : '',
    sortOrder : 0,
    seoTitle : '',
    categoryTags : '',
    content : '',
    imageUrl: '',
    seoKeyword: ''
  }

  formGroup: FormGroup;
  @Input() id: number;
  @Input() listCategoryParent: any;
  category: Categories = {
    id: undefined,
    categoryName : '',
    status: 0,
    categoryParent : 0,
    seoDescription : '',
    sortOrder : 0,
    seoTitle : '',
    categoryTags : '',
    content : '',
    imageUrl: '',
    seoKeyword: ''
  };
  isLoading = false;
  subscriptions: Subscription[] = [];
  public fileReview : any;
  public urlImage = environment.urlImage;
  constructor(private categoryService: CategoriesService, public modal: NgbActiveModal,
  private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {  
    this.loadCategory();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      categoryName: [this.category.categoryName, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(150)])],
         seoDescription: [this.category.seoDescription,  Validators.compose([Validators.required, Validators.maxLength(200)])],
         seoKeyword: [this.category.seoDescription,  Validators.compose([Validators.required, Validators.maxLength(150)])],
         seoTitle: [this.category.seoDescription,  Validators.compose([Validators.required, Validators.maxLength(50)])],
         categoryParent: [this.category.categoryParent],
         categoryTags: [this.category.categoryTags],
         content :[this.category.content],
         sortOrder: [this.category.sortOrder],
         file : new FormControl(''),
         imageUrl : new FormControl('')
    });

    this.isLoading = true;
  }

  deleteAttribute() {
    this.isLoading = true;
    const sb = this.categoryService.delete(this.id, '').pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
      
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  // this.category.categoryName = formData.categoryName;
  // this.category.sortOrder = formData.sortOrder;
  // this.category.seoDescription = formData.seoDescription;
  // this.category.seoKeyword = formData.seoKeyword;
  // this.category.seoTitle = formData.seoTitle;
  // this.category.content = formData.content;
  // this.category.categoryTags = formData.categoryTags;
  // this.category.categoryParent = formData.categoryParent;

  AddCategory() {
    this.isLoading = true;
    var modelPost = new FormData ();
    modelPost.append('ImageUrl', this.formGroup.get('imageUrl').value);
    modelPost.append('CategoryName',   this.category.categoryName);
    modelPost.append('SortOrder', this.category.sortOrder.toString());
    modelPost.append('SeoDescription', this.category.seoDescription);
    modelPost.append('SeoKeyword', this.category.seoKeyword);
    modelPost.append('SeoTitle', this.category.seoTitle);
    modelPost.append('Content', this.category.content);
    modelPost.append('CategoryTags', this.category.categoryTags);
    modelPost.append('CategoryParent', this.category.categoryParent.toString());
 
    const sb = this.categoryService.createWithImage(modelPost, '/v1/category').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap((res: any) =>
      {  
        this.checkSuccessEditOrAdd(res, "Thêm");     
        this.modal.close(); // thêm thành công thêm nữa ko close
      }
      ),
      catchError((err) => {
        this.modal.dismiss(err);
        this.srvAlter.toast(TYPE.ERROR, "Thêm không thành công!", false);
        return of(undefined);
      }),
      finalize(() => {
        //this.isLoading = false;
        // tính sau 
        this.categoryService.fetch();
      })
    ).subscribe(
      );
    this.subscriptions.push(sb);
  }

  edit() {
    this.isLoading = true;
    var modelUpdate = new FormData ();
    modelUpdate.append('CategoryID',   this.category.id.toString());
    modelUpdate.append('ImageUrl', this.formGroup.get('imageUrl').value);
    modelUpdate.append('CategoryName',   this.category.categoryName);
    modelUpdate.append('SortOrder', this.category.sortOrder.toString());
    modelUpdate.append('SeoDescription', this.category.seoDescription);
    modelUpdate.append('SeoKeyword', this.category.seoKeyword);
    modelUpdate.append('SeoTitle', this.category.seoTitle);
    modelUpdate.append('Content', this.category.content);
    modelUpdate.append('CategoryTags', this.category.categoryTags);
    modelUpdate.append('CategoryParent', this.category.categoryParent.toString());

    const sbUpdate = this.categoryService.updateWithImage(modelUpdate, '/v1/category').pipe(
      tap((res : any) => {
        this.modal.close();
        this.checkSuccessEditOrAdd( res, "Cập nhật");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.category);
      }),
    ).subscribe(res => this.category = res);
    this.subscriptions.push(sbUpdate);
  }

  loadCategory() {
    if (!this.id) {
      this.category = this.EMPTY_Attribute_Value;
      this.loadForm();
    } else {
      const sb = this.categoryService.getItemById(this.id, '/v1/category/by-id?id=').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.EMPTY_Attribute_Value);
        })
      ).subscribe((att: any) => {
        this.category = {
          id:  att.data.id,
          categoryName : att.data.categoryName,
          status:  att.data.status,
          categoryParent : att.data.categoryParent,
          seoDescription : att.data.seoDescription ?? '',
          sortOrder : att.data.sortOrder,
          seoTitle : att.data.seoTitle ?? '',
          categoryTags : att.data.categoryTags ?? '',
          content :  att.data.content ?? '',
          imageUrl: att.data.imageUrl ?? '',
          seoKeyword: att.data.seoKeyword ?? ''
        };
        if(att.data.imageUrl && att.data.imageUrl !== ''){
          this.fileReview = this.urlImage + att.data.imageUrl;
        }
        
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  onFileChange(event) { 
    if (event.target.files.length > 0) {
      debugger;
      const file = event.target.files[0];
      this.formGroup.get('imageUrl').setValue(file);;

      const reader = new FileReader();
        reader.onload = e => this.fileReview = reader.result;
        reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  save() {
    this.prepareAttribute();
    if (!this.formGroup.valid) {
      this.validateAllFormFields(this.formGroup);
      return;
    }

    if (this.category.id) {
      this.edit();
    } else {
      this.AddCategory();
    }
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
    this.category.categoryName = formData.categoryName;
    this.category.sortOrder = formData.sortOrder;
    this.category.seoDescription = formData.seoDescription;
    this.category.seoKeyword = formData.seoKeyword;
    this.category.seoTitle = formData.seoTitle;
    this.category.content = formData.content;
    this.category.categoryTags = formData.categoryTags;
    this.category.categoryParent = formData.categoryParent;
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

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
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

  checkSuccessEditOrAdd(res: any, action : string){
    if(res && res.statusCode === 200 && res.errorCode == 0){
      this.srvAlter.toast(TYPE.SUCCESS, action + " thành công!", false);

    }else{
      this.srvAlter.toast(TYPE.ERROR, action + " không thành công!", false);
    }
  };
}
