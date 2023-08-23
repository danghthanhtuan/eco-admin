import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { Filter } from '../../../_models/filter.model';
import { FiltersService } from '../../../_services/filter.service';

@Component({
  selector: 'app-add-filter-modal',
  templateUrl: './add-filter-modal.component.html',
  styleUrls: []
})
export class AddFilterModalComponent implements OnInit, OnDestroy {
  EMPTY_Filter: any = {
    id: undefined,
    displayText: '',
    typeSearch: '0',
    sortOrder: 1
  }

  formGroup: FormGroup;
  @Input() id: number;
  filter: Filter = {
    id: undefined,
    displayText: '',
    typeSearch: '0',
    sortOrder: 1
  };
  isLoading = false;
  subscriptions: Subscription[] = [];
  constructor(private filterService: FiltersService, public modal: NgbActiveModal,
    private fb: FormBuilder, private srvAlter: SwalService) { }

  ngOnInit(): void {
    this.loadFilters();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      displayText: [this.filter.displayText,
      Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      typeSearch: [this.filter.typeSearch],
      sortOrder: [this.filter.sortOrder]
    });

    this.isLoading = true;
  }

  deleteAttribute() {
    this.isLoading = true;
    const sb = this.filterService.delete(this.id, '').pipe(
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

  AddFilter() {
    this.isLoading = true;
    const sb = this.filterService.createArr(this.filter, '/v1/filters').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap((res: any) => {
        this.modal.close()
        this.checkSuccessEditOrAdd(res, 'Thêm');
      } //thêm thành công thêm nữa ko close
      ),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        //this.isLoading = false;
        // tính sau 
        this.filterService.fetch();
      })
    ).subscribe(


    );
    this.subscriptions.push(sb);
  }

  edit() {
    var modelUpdate :any = {
      filterId : this.filter.id,
        displayText : this.filter.displayText,
        sortOrder : this.filter.sortOrder
    }
    const sbUpdate = this.filterService.update(modelUpdate, '/v1/filters').pipe(
      tap((res: any) => {
        this.checkSuccessEditOrAdd(res, "Cập nhật")
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.filter);
      }),
    ).subscribe(res => this.filter = res);
    this.subscriptions.push(sbUpdate);
  }

  loadFilters() {
    if (!this.id) {
      this.filter = this.EMPTY_Filter;
      this.loadForm();
    } else {
      const sb = this.filterService.getItemById(this.id, '/v1/filters/by-id?filterId=').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.EMPTY_Filter);
        })
      ).subscribe((att: any) => {
        this.filter = {
          id: att.data?.id,
          displayText : att.data?.displayText,
          typeSearch: att.data?.typeSearch.toString(),
          sortOrder : 1
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
    if (this.filter.id) {
      this.edit();
    } else {
      this.AddFilter();
    }
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
    this.filter.typeSearch = formData.typeSearch;
    this.filter.displayText = formData.displayText;
    this.filter.sortOrder = formData.sortOrder;
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
