import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { ProductImage } from 'src/app/modules/e-commerce/_models/product-image.model';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { ProductImagesService } from 'src/app/modules/e-commerce/_services/product-images.service';

@Component({
  selector: 'app-product-image-modal',
  templateUrl: './product-image-modal.component.html',
  styleUrls: []
})
export class ProductImageModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() productId: number;
  @Output() add = new EventEmitter<any>();
  isLoading = false;
  image: any = {
    sortOrder : 1,
    imageUrl : '' 
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
      sortOrder: [this.image.sortOrder],
         file : new FormControl(''),
         imageUrl : new FormControl('', Validators.required)
    });

    this.isLoading = true;
  }

  save() {
    this.prepareSpec();
    if (this.image.id) {
     // this.edit();
    } else {
      this.create();
    }
  }

  create() {
    var add : any = {
      sortOrder : this.image.sortOrder,
      imageUrl : this.formGroup.get('imageUrl')
    }
    this.add.emit(add);
  }

  private prepareSpec() {
    const formData = this.formGroup.value;
    this.image.sortOrder = formData.sortOrder;
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
