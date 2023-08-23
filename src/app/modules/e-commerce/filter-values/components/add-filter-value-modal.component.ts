import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { CommonModule } from '@angular/common';  
import { FilterValueService } from '../../_services/filter-value.service';
import { FilterValue } from '../../_models/filter.model';

@Component({
  selector: 'app-add-filter-value-modal',
  templateUrl: './add-filter-value-modal.component.html',
  styleUrls: []
})
export class AddFilterValueModalComponent implements OnInit, OnDestroy {
  EMPTY_Filter_Value : any = {
    id: undefined,
    filterValueId: undefined,
    filterId : undefined,
    filterValueDisplayText: '',
    sortOrder : 1,
    filterSearchKey: '',
    minPrice : 0,
    maxPrice: 0
  }

  formGroup: FormGroup;
  @Input() id: number;
  @Input() listFilters: any;

  filterValue: FilterValue = {
    id: undefined,
    filterValueId: undefined,
    filterId : undefined,
    filterValueDisplayText: '',
    sortOrder : 1,
    filterSearchKey: '',
    minPrice : 0,
    maxPrice: 0
  };
  isLoading = false;
  subscriptions: Subscription[] = [];
  typeSearchKey = 0;
  constructor(private filterValueService:  FilterValueService, public modal: NgbActiveModal,
    private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {
    this.loadFilterValue();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      filterValueDisplayText: [this.filterValue.filterValueDisplayText,
          Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      filterSearchKey: [this.filterValue.filterSearchKey,  Validators.compose([])],
      filterId: [this.filterValue.filterId,  Validators.compose([Validators.required])],
      minPrice: [this.filterValue.minPrice, ],
      maxPrice: [this.filterValue.maxPrice,  ],
      sortOrder: [this.filterValue.sortOrder]
    });

    this.isLoading = true;
  }

  deleteAttribute() {
    this.isLoading = true;
    const sb = this.filterValueService.delete(this.id, '').pipe(
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

  AddFilterValue() {
    this.isLoading = true;
    var modelPost : any = {
      filterID : this.filterValue.filterId,
      createFilterValueItems : [{
        filterSearchKey : this.filterValue.filterSearchKey,
        filterValueDisplayText :this.filterValue.filterValueDisplayText,
        sortOrder :this.filterValue.sortOrder,
        minPrice :this.filterValue.minPrice,
        maxPrice :this.filterValue.maxPrice
      }]

    }
    const sb = this.filterValueService.create(modelPost, '/v1/filters/value').pipe(
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
        this.filterValueService.fetch();
      })
    ).subscribe(
     
      
      );
    this.subscriptions.push(sb);
  }

  edit() {
    var modelPut : any = {
      filterValueID : this.filterValue.filterValueId,
      filterSearchKey : this.filterValue.filterSearchKey,
      filterValueDisplayText :this.filterValue.filterValueDisplayText,
      sortOrder :this.filterValue.sortOrder,
      minPrice :this.filterValue.minPrice,
      maxPrice :this.filterValue.maxPrice
    }

    const sbUpdate = this.filterValueService.update( modelPut, '/v1/filters/value').pipe(
      tap(( res: any) => {
        this.modal.close();
        this.checkSuccessEditOrAdd(res, "Cập nhật");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.filterValue);
      }),
    ).subscribe(res => this.filterValue = res);
    this.subscriptions.push(sbUpdate);
  }

  loadFilterValue() {
    if (!this.id) {
      this.filterValue = this.EMPTY_Filter_Value;
      this.loadForm();
    } else {
      const sb = this.filterValueService.getItemById(this.id, '/v1/filters/value/by-id?filterValueId=').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.EMPTY_Filter_Value);
        })
      ).subscribe((att: any) => {
        this.filterValue = {
          filterValueId: att.data?.filterValueID,
          filterId : att.data?.filterID,
          filterSearchKey: att.data?.filterSearchKey ?? '',
          sortOrder : att.data?.filterValueSortOrder,
          minPrice: att.data?.minPrice,
          maxPrice :  att.data?.maxPrice,
          id : undefined,
          filterValueDisplayText :  att.data?.filterValueDisplayText
        };
        this.typeSearchKey = att.data?.typeSearch;
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  onChange(value : string){
    var item = this.listFilters.filter(
      f => f.id == value);
    if(item)
    {
      this.typeSearchKey = item[0].typeSearch;
    }  
  }

  save() {
    this.prepareAttribute();
    if (!this.formGroup.valid) {
      this.validateAllFormFields(this.formGroup);
      return;
    }

    if (this.filterValue.filterValueId) {
      this.edit();
    } else {
      this.AddFilterValue();
    }
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
     this.filterValue.sortOrder = formData.sortOrder;
     this.filterValue.filterValueDisplayText = formData.filterValueDisplayText;
     this.filterValue.filterId = formData.filterId; 
     this.filterValue.minPrice = formData.minPrice;
     this.filterValue.filterSearchKey = formData.filterSearchKey;
     this.filterValue.maxPrice = formData.maxPrice;
    
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
