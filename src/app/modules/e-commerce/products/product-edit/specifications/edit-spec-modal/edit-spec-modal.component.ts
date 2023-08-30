import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { ProductSpecification } from '../../../../_models/product-specification.model';
import { SPECIFICATIONS_DICTIONARY } from '../../../../_models/specification.dictionary';
import { SpecificationsService } from '../../../../_services';
import { ProductImage } from 'src/app/modules/e-commerce/_models/product-image.model';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { ProductImagesService } from 'src/app/modules/e-commerce/_services/product-images.service';

const EMPTY_SPEC: ProductImage = {
  id: undefined,
  sortOrder: 1,
  imageUrl: ''
};

@Component({
  selector: 'app-edit-spec-modal',
  templateUrl: './edit-spec-modal.component.html',
  styleUrls: []
})
export class EditSpecModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() productId: number;
  isLoading = false;
  spec: ProductImage={
    id: undefined,
    sortOrder : 1,
    imageUrl: '',
  };
  formGroup: FormGroup;
  fileReview : any;
  private subscriptions: Subscription[] = [];
  constructor(
    private specsService: ProductImagesService,
    private fb: FormBuilder, public modal: NgbActiveModal,
    private srvAlter: SwalService
    ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      sortOrder: [this.spec.sortOrder],
         file : new FormControl(''),
         imageUrl : new FormControl('', Validators.required)
    });

    this.isLoading = true;
  }

  save() {
    this.prepareSpec();
    if (this.spec.id) {
     // this.edit();
    } else {
      this.create();
    }
  }

  // edit() {
  //   const sbUpdate = this.specsService.update(this.spec, '').pipe(
  //     tap(() => {
  //       this.modal.close();
  //     }),
  //     catchError((errorMessage) => {
  //       this.modal.dismiss(errorMessage);
  //       return of(this.spec);
  //     }),
  //   ).subscribe(res => this.spec = res);
  //   this.subscriptions.push(sbUpdate);
  // }

  create() {
    var modelPost = new FormData ();
    modelPost.append('Image', this.formGroup.get('imageUrl').value);
    modelPost.append('ProductId',   this.productId.toString());
    modelPost.append('SortOrder', this.spec.sortOrder.toString());
    const sbCreate = this.specsService.createWithImage(modelPost, '/v1/ProductImage').pipe(
      tap((res: any) => {

        this.checkSuccessEditOrAdd(res, "Thêm hình ảnh");
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.spec);
      }),
    ).subscribe((res: ProductImage) => this.spec = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareSpec() {
    const formData = this.formGroup.value;
    this.spec.sortOrder = formData.sortOrder;
  }

  onFileChange(event) { 
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formGroup.get('imageUrl').setValue(file);

      const reader = new FileReader();
        reader.onload = e => this.fileReview = reader.result;
        reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void {
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

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
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
