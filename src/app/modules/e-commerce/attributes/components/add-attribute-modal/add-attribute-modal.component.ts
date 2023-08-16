import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { AttributesService } from '../../../_services/attributes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../_models/attribute.model';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';

@Component({
  selector: 'app-add-attribute-modal',
  templateUrl: './add-attribute-modal.component.html',
  styleUrls: []
})
export class AddAttributeModalComponent implements OnInit, OnDestroy {
  EMPTY_Attribute : any = {
    id: undefined,
    attributeName : '',
    url: ''
  }

  formGroup: FormGroup;
  @Input() id: number;
  attributes: Attribute = {
    id: undefined,
    attributeName : '',
    url: ''
  };
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private attributeService: AttributesService, public modal: NgbActiveModal,
    private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {
    
    this.loadAttribute();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      attributeName: [this.attributes.attributeName,
         Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
         url: [this.attributes.url,
          Validators.compose([])],
    });

    this.isLoading = true;
  }

  deleteAttribute() {
    this.isLoading = true;
    const sb = this.attributeService.delete(this.id, '').pipe(
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

  edit() {
    const sbUpdate = this.attributeService.update(this.attributes, '/v1/attribute').pipe(
      tap(() => {
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.attributes);
      }),
    ).subscribe(res => this.attributes = res);
    this.subscriptions.push(sbUpdate);
  }

  loadAttribute() {
    if (!this.id) {
      this.attributes = this.EMPTY_Attribute;
      this.loadForm();
    } else {
      const sb = this.attributeService.getItemById(this.id, '/v1/attribute/by-id?id=').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.EMPTY_Attribute);
        })
      ).subscribe((att: any) => {
        this.attributes = {
          id: att.data?.id,
          attributeName : att.data?.name,
          url: att.data?.url ?? ''
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
    if (this.attributes.id) {
      this.edit();
    } else {
      this.AddAttribute();
    }
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
    this.attributes.attributeName = formData.attributeName;
    this.attributes.url = formData.url;
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
