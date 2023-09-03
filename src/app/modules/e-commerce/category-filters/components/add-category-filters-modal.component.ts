import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { CommonModule } from '@angular/common';  
import { FilterValueService } from '../../_services/filter-value.service';
import { CategoryFilterAddService } from '../../_services/category-filter-add.service';
import { GroupingState } from 'src/app/_metronic/shared/crud-table';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-add-category-filters-modal',
  templateUrl: './add-category-filters-modal.component.html',
  styleUrls: []
})
export class AddCategoryFilterValueModalComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  @Input() id: number;
  @Input() listFilters: any;
  grouping: GroupingState;
  filterGroup: FormGroup;
  searchGroup: FormGroup;

  isLoading: boolean;
  subscriptions: Subscription[] = [];
  typeSearchKey = 0;
  constructor(public modal: NgbActiveModal,
    private fb: FormBuilder,private srvAlter: SwalService 
    ,public categoryFilterAddService:  CategoryFilterAddService,) { }
   
  ngOnInit(): void {
    this.categoryFilterAddService.patchState({ entityId: this.id }); 
    this.grouping = this.categoryFilterAddService.grouping;
    const sb = this.categoryFilterAddService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
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

  updateCheckedForSelected() {
    debugger;
    var ids : any = [];
    this.grouping.selectedRowIds.forEach(item => {
      ids.push(item);
    })
    var modelUpdate = {
      categoryID : this.id,
      filterValueIDs : ids
    }

    const sbUpdate = this.categoryFilterAddService.updateCategoryFilterValue(modelUpdate, '/v1/filters/category-add-filter-value').pipe(
      tap((res: any) => {
        this.checkSuccessEditOrAdd(res, "Cập nhật");
        this.modal.close();
      }
      ),
      catchError((errorMessage) => {
        console.error('UPDATE ERROR', errorMessage);
        return of(errorMessage.error);
      })
    ).subscribe(res => {
      // debugger;
      // this.loadProduct();
    });
    this.subscriptions.push(sbUpdate);
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
