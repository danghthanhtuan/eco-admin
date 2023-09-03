import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { CommonModule } from '@angular/common';  
import { ProductsService } from '../../_services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-to-trans-modal',
  templateUrl: './add-product-to-trans-modal.component.html',
  styleUrls: []
})
export class AddProducutToTransModalComponent implements OnInit, OnDestroy {
  model : any = {
    productId: 0,
    quantity : 0,
  }

  formGroup: FormGroup;
  @Input() id: number;
  @Input() orderItem: any;
  @Output() edit = new EventEmitter<any>();
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private productService: ProductsService, public modal: NgbActiveModal,
    private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      productId: [this.orderItem.productId ],
      quantity: [this.orderItem.quantity,  Validators.compose([Validators.required])]
    });

    this.isLoading = true;
  }

  update() {
    var edit : any = {
      productId : this.formGroup.get('productId').value,
      quantity : this.formGroup.get('quantity').value
    }
    this.edit.emit(edit);
    this.modal.close();
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
}
