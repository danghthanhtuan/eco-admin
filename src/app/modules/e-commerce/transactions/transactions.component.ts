// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
import { environment } from 'src/environments/environment';
import { TransactionsService } from '../_services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: [],
})
export class TransactionsComponent
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
  public urlImage = environment.urlImage;
  listCategoryParent: any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public transactionService: TransactionsService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.filterForm();
    this.searchForm();
    this.transactionService.fetch();
    const sb = this.transactionService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.transactionService.grouping;
    this.paginator = this.transactionService.paginator;
    // this.sorting = this.tradeService.sorting;
    //this.attributeService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );

  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;
    if (status) {
      filter['status'] = status;
    }

    this.transactionService.patchState({ filter });
  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
      searchPhone: [''],
      searchOrderCode: [''],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        debounceTime(550),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));

    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.transactionService.patchState({ searchTerm });
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
    this.transactionService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.transactionService.patchState({ paginator });
  }

  getStatusName(status: number) {
    switch (status) {
      case 1: {
        return "Mới";
      }
      case 2: {
        return "Đang xử lý";
      }
      case 3: {
        return "Đang giao";
      }
      case 4: {
        return "Hoàn thành";
      }
      case 5: {
        return "Đã huỷ";
      }
      default: ""
    }
  }

  // actions

  // delete(id: number) {
  //   const modalRef = this.modalService.open(DeleteTrademarksModalComponent, );
  //   modalRef.componentInstance.id = id;
  //   modalRef.result.then(
  //     () => this.tradeService.fetch(),
  //     () => { }
  //   );
  // }

  // addTrademarks(id: number) {
  //   const modalRef = this.modalService.open(AddTrademarksModalComponent, {size: 'xl'});
  //   modalRef.componentInstance.id = id;
  //  // modalRef.componentInstance.listCategoryParent = this.listCategoryParent;
  //   modalRef.result.then(
  //     () => this.tradeService.fetch(),
  //     () => { }
  //   );
  // }

  // deleteSelected() {
  //   const modalRef = this.modalService.open(DeleteCategoriesServiceModalComponent);
  //   modalRef.componentInstance.ids = this.grouping.getSelectedRows();
  //   modalRef.result.then(
  //     () => this.categoriesService.fetch(),
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
