// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  GroupingState,
  PaginatorState,
  SortState,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction,
  ISortView,
  IFilterView,
  IGroupingView,
  ISearchView,
} from '../../../_metronic/shared/crud-table';
import { AttributeValueService } from '../_services/attribute-value.service';
import { AddFilterValueModalComponent } from './components/add-filter-value-modal.component';
import { FilterValueService } from '../_services/filter-value.service';

// import { DeleteProductsModalComponent } from './components/delete-products-modal/delete-products-modal.component';
// import { UpdateProductsStatusModalComponent } from './components/update-products-status-modal/update-products-status-modal.component';
// import { FetchProductsModalComponent } from './components/fetch-products-modal/fetch-products-modal.component';

@Component({
  selector: 'app-filter-values',
  templateUrl: './filter-values.component.html',
  styleUrls: [],
})
export class FilterValuesComponent
  implements
  OnInit,
  OnDestroy,
  // IDeleteAction,
  // IDeleteSelectedAction,
  // IFetchSelectedAction,
  // IUpdateStatusForSelectedAction,
  // ISortView,
  // IFilterView,
  // IGroupingView,
  // ISearchView,
  IFilterView {
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  listFilters : any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    //public productsService: ProductsService,
    public filterValueService : FilterValueService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.getListFilters();
    this.filterForm();
    this.searchForm();
    this.filterValueService.fetch();
    // const sb = this.filterValueService.isLoading$.subscribe(res => this.isLoading = res);
    // this.subscriptions.push(sb);
    this.grouping = this.filterValueService.grouping;
    this.paginator = this.filterValueService.paginator;
    //this.sorting = this.attributeValueService.sorting;
    //this.attributeService.fetch();
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getListFilters(){
    this.filterValueService.getAllFiltres()
    .subscribe(
      (res: any) => {
        this.listFilters = res;
      }
    )
    //.subscribe();
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      filterId: [''],
      condition: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.filterId.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.condition.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const filterId = this.filterGroup.get('filterId').value;
    if (filterId) {
      filter['filterId'] = filterId;
    }

    // const condition = this.filterGroup.get('condition').value;
    // if (condition) {
    //   filter['condition'] = condition;
    // }
    this.filterValueService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
  The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
  we are limiting the amount of server requests emitted to a maximum of one every 150ms
  */
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.filterValueService.patchState({ searchTerm });
  }

  // sorting
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.filterValueService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.filterValueService.patchState({ paginator });
  }
  // actions
  
  delete(id: number) {
    // const modalRef = this.modalService.open(DeleteAttributeValueModalComponent, );
    // modalRef.componentInstance.id = id;
    // modalRef.result.then(
    //   () => this.attributeValueService.fetch(),
    //   () => { }
    // );
  }

  addFilterValue(id: number) {
    const modalRef = this.modalService.open(AddFilterValueModalComponent, {size: 'xl'});
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.listFilters = this.listFilters;
    modalRef.result.then(
      () => this.filterValueService.fetch(),
      () => { }
    );
  }

  // deleteSelected() {
  //   const modalRef = this.modalService.open(DeleteAttributeModalComponent);
  //   modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  //   modalRef.result.then(
  //     () => this.attributeService.fetch(),
  //     () => { }
  //   );
  // }

  // updateStatusForSelected() {
  //   const modalRef = this.modalService.open(
  //     UpdateProductsStatusModalComponent
  //   );
  //   modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  //   modalRef.result.then(
  //     () => this.productsService.fetch(),
  //     () => { }
  //   );
  // }

  // fetchSelected() {
  //   const modalRef = this.modalService.open(FetchProductsModalComponent);
  //   modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  //   modalRef.result.then(
  //     () => this.productsService.fetch(),
  //     () => { }
  //   );
  // }
}
