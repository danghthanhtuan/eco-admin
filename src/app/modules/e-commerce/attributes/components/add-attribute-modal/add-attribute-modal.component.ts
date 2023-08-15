import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { ProductsService } from '../../../_services';
import { AttributesService } from '../../../_services/attributes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Attribute } from '../../../_models/attribute.model';

@Component({
  selector: 'app-add-attribute-modal',
  templateUrl: './add-attribute-modal.component.html',
  styleUrls: ['./add-attribute-modal.component.scss']
})
export class AddAttributeModalComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  @Input() id: number;
  attributes: Attribute = {
    id: undefined,
    attributeName : '',
    url: ''
  };
  isLoading = true;
  subscriptions: Subscription[] = [];

  constructor(private attributeService: AttributesService, public modal: NgbActiveModal,
    private fb: FormBuilder,) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      attributeName: [this.attributes.attributeName,
         Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
         url: [this.attributes.url,
          Validators.compose([])],
    });
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
        this.isLoading = false;



      })
    ).subscribe(this.attributeService.fetch);
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  save() {
    this.prepareAttribute();
    if (this.attributes.id) {
      //this.edit();
    } else {
      this.AddAttribute();
    }
  }

  private prepareAttribute() {
    debugger;
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
