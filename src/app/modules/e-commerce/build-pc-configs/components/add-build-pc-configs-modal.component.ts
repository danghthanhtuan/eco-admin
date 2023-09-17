import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { environment } from 'src/environments/environment';
import { BuildPcConfigsService } from '../../_services/build-pc-configs.service';
import { BuildPC } from '../../_models/build-pc.model';

@Component({
  selector: 'app-add-build-pc-configs-modal',
  templateUrl: './add-build-pc-configs-modal.component.html',
  styleUrls: []
})
export class AddBuildPCConfigModalComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  @Input() id: number;
  @Input() name: string;
  @Input() search: string;
  //@Input() listCategoryParent: any;
  buildpc: BuildPC = {
    id: undefined,
    name: '',
    keySearch: '',
    categoryIds: ''
  };
  isLoading = false;
  subscriptions: Subscription[] = [];
  public fileReview: any;
  public urlImage = environment.urlImage;
  constructor(private buildService: BuildPcConfigsService, public modal: NgbActiveModal,
    private fb: FormBuilder, private srvAlter: SwalService) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.buildpc.id = this.id;
    this.buildpc.keySearch = this.search;
    this.buildpc.name = this.name;
    // Validators.compose([ Validators.minLength(1), Validators.maxLength(200)])
    this.formGroup = this.fb.group({
      name: [this.buildpc.name,],
      keySearch: [this.buildpc.keySearch],
      categoryIds: [this.buildpc.categoryIds],
    });

    this.isLoading = true;
  }

  edit() {
    this.isLoading = true;
    var modelUpdate :any =  {
      ID : this.buildpc.id.toString(),
      KeySearch : this.buildpc.keySearch
    };

    const sbUpdate = this.buildService.update(modelUpdate, '/v1/buildpc').pipe(
      tap((res: any) => {
        this.modal.close();
        this.checkSuccessEditOrAdd(res, "Cập nhật");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.buildpc);
      }),
    ).subscribe(res => this.buildpc = res);
    this.subscriptions.push(sbUpdate);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
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

    if (this.buildpc.id) {
      this.edit();
    } else {
      //this.AddBanner();
    }
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
    this.buildpc.keySearch = formData.keySearch;
    this.buildpc.name = formData.name;
    ///this.banner.sortOrder = formData.sortOrder;
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

  checkSuccessEditOrAdd(res: any, action: string) {
    if (res && res.statusCode === 200 && res.errorCode == 0) {
      this.srvAlter.toast(TYPE.SUCCESS, action + " thành công!", false);

    } else {
      this.srvAlter.toast(TYPE.ERROR, action + " không thành công!", false);
    }
  };
}
