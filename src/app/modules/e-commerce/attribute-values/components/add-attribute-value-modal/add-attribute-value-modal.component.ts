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

@Component({
  selector: 'app-add-attribute-value-modal',
  templateUrl: './add-attribute-value-modal.component.html',
  styleUrls: []
})
export class AddAttributeValueModalComponent implements OnInit, OnDestroy {
  EMPTY_Attribute_Value : any = {
    id: undefined,
    attributeName : '',
    url: ''
  }

  formGroup: FormGroup;
  @Input() id: number;
  @Input() listAttributes: any;
  attributeValue: AttributeValue = {
    id: undefined,
    name : '',
    url: '',
    nameExtra : '',
    attributeId : undefined
  };
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private attributeValueService: AttributeValueService, public modal: NgbActiveModal,
    private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {
    
    this.loadAttributeValue();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      attributeValueName: [this.attributeValue.name,
         Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
         url: [this.attributeValue.url,  Validators.compose([])],
         attributeId: [this.attributeValue.attributeId,  Validators.compose([Validators.required])]
    });

    this.isLoading = true;
  }

  deleteAttribute() {
    this.isLoading = true;
    const sb = this.attributeValueService.delete(this.id, '').pipe(
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

  AddAttributeValue() {
    this.isLoading = true;
    var modelPost : any = {
      attributeID : this.attributeValue.attributeId,
      attributeValuesRequest : [{
        attributeValueName : this.attributeValue.name,
        url :this.attributeValue.url,
      }]

    }
    const sb = this.attributeValueService.create(modelPost, '/v1/attribute/value').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap(() =>
      //  this.modal.close() thêm thành công thêm nữa ko close
      {}
      ),
      catchError((err) => {
        this.modal.dismiss(err);
        this.srvAlter.toast(TYPE.ERROR, "Thêm không thành công!", false);
        return of(undefined);
      }),
      finalize(() => {
        //this.isLoading = false;
        // tính sau 
        this.srvAlter.toast(TYPE.SUCCESS, "Thêm thành công!", false);
        this.attributeValueService.fetch();
      })
    ).subscribe(
     
      
      );
    this.subscriptions.push(sb);
  }

  edit() {
    var modelUpdate : any = {
      attributeValueID : this.attributeValue.id,
      attributeValueName : this.attributeValue.name,
      url : this.attributeValue.url
    };

    const sbUpdate = this.attributeValueService.update( modelUpdate, '/v1/attribute/value').pipe(
      tap(() => {
        this.modal.close();
        this.srvAlter.toast(TYPE.SUCCESS, "Cập nhật thành công!", false);
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.attributeValue);
      }),
    ).subscribe(res => this.attributeValue = res);
    this.subscriptions.push(sbUpdate);
  }

  loadAttributeValue() {
    if (!this.id) {
      this.attributeValue = this.EMPTY_Attribute_Value;
      this.loadForm();
    } else {
      const sb = this.attributeValueService.getItemById(this.id, '/v1/attribute/value/by-id?attributeId=').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.EMPTY_Attribute_Value);
        })
      ).subscribe((att: any) => {
        this.attributeValue = {
          id: att.data?.id,
          name : att.data?.name,
          url: att.data?.url ?? '',
          attributeId: att.data?.attributeId ?? 0,
          nameExtra : att.data?.nameExtra ?? ''
        };
        this.loadForm();
      });
      this.subscriptions.push(sb);
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

    if (this.attributeValue.id) {
      this.edit();
    } else {
      this.AddAttributeValue();
    }
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
    this.attributeValue.name = formData.attributeValueName;
    this.attributeValue.url = formData.url;
    this.attributeValue.attributeId = formData.attributeId;
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
