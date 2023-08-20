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
import { TrademarksService } from '../_services/trademarks.service';
import { FiltersService } from '../_services/filter.service';
import { DeleteFilterModalComponent } from './components/delete-filter-modal/delete-filter-modal.component';
import { AddFilterModalComponent } from './components/add-filter-modal/add-filter-modal.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: [],
})
export class FiltersComponent
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
  listCategoryParent : any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public filterService : FiltersService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
   // this.getListCategoryParent();
    this.filterForm();
    this.searchForm();
    this.filterService.fetch();
    const sb = this.filterService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.filterService.grouping;
    this.paginator = this.filterService.paginator;
    // this.sorting = this.tradeService.sorting;
    //this.attributeService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      categoryParent: [''],
      condition: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.categoryParent.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.condition.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const categoryParent = this.filterGroup.get('categoryParent').value;
    if (categoryParent) {
      filter['categoryParent'] = categoryParent;
    }

    // const condition = this.filterGroup.get('condition').value;
    // if (condition) {
    //   filter['condition'] = condition;
    // }
    this.filterService.patchState({ filter });
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
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }

  search(searchTerm: string) {
    this.filterService.patchState({ searchTerm });
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
    this.filterService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.filterService.patchState({ paginator });
  }
  // actions
  
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteFilterModalComponent, );
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.filterService.fetch(),
      () => { }
    );
  }

  addFilters(id: number) {
    const modalRef = this.modalService.open(AddFilterModalComponent, {size: 'xl'});
    modalRef.componentInstance.id = id;
   // modalRef.componentInstance.listCategoryParent = this.listCategoryParent;
    modalRef.result.then(
      () => this.filterService.fetch(),
      () => { }
    );
  }

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
