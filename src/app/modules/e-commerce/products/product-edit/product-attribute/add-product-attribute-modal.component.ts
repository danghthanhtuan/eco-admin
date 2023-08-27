import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { AttributesService } from '../../../_services/attributes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../_models/attribute.model';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { CommonModule } from '@angular/common';  
import { AttributeValueService } from '../../../_services/attribute-value.service';

@Component({
  selector: 'app-add-product-attribute-modal',
  templateUrl: './add-product-attribute-modal.component.html',
  styleUrls: []
})
export class AddProductAttributeModalComponent implements OnInit, OnDestroy {
  EMPTY_Attribute : any = {
    id: undefined,
    attributeName : '',
    url: ''
  }

  formGroup: FormGroup;
  @Input() id: number;
  @Input() listAttributes: any;
  @Output() add = new EventEmitter<any>();
  attributes: any = {
    attributeValueId : '',
  };
  isLoading = false;
  subscriptions: Subscription[] = [];
  
  constructor(private attributeService: AttributesService, public modal: NgbActiveModal,
    private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {
    
    this. loadForm() ;
  }

  loadForm() {
    this.formGroup = this.fb.group({
      attributeValueId: [this.attributes.attributeValueId,
         Validators.compose([Validators.required])]
    });

    this.isLoading = true;
  }


  AddAttribute() {
    this.isLoading = true;
    const sb = this.attributeService.createArr(this.attributes, '/v1/attribute').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap(() =>
      //  this.modal.close() thêm thành công thêm nữa ko close
      {}
      ),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        //this.isLoading = false;
        // tính sau 
        this.srvAlter.toast(TYPE.SUCCESS, "Thêm thành công!", false);
        this.attributeService.fetch();
      })
    ).subscribe(
     
      
      );
    this.subscriptions.push(sb);
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  save() {
    this.prepareAttribute();
    this.add.emit(this.attributes.attributeValueId);
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
    this.attributes.attributeValueId = formData.attributeValueId;
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
}
