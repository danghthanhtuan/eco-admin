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
import { DeleteBannersModalComponent } from './components/delete-banners-modal.component';
import { AddBannersModalComponent } from './components/add-banners-modal.component';
import { BannersService } from '../_services/banners.service';

@Component({
  selector: 'app-trademarks',
  templateUrl: './banners.component.html',
  styleUrls: [],
})
export class BannersComponent
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
    public bannerService : BannersService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
   // this.getListCategoryParent();
    this.filterForm();
    this.searchForm();
    this.bannerService.fetch();
    // const sb = this.tradeService.isLoading$.subscribe(res => this.isLoading = res);
    // this.subscriptions.push(sb);
    this.grouping = this.bannerService.grouping;
    this.paginator = this.bannerService.paginator;
    // this.sorting = this.tradeService.sorting;
    //this.attributeService.fetch();
    this.isLoading = false;
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
    this.bannerService.patchState({ filter });
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
    this.bannerService.patchState({ searchTerm });
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
    this.bannerService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.bannerService.patchState({ paginator });
  }
  // actions
  
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteBannersModalComponent, );
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.bannerService.fetch(),
      () => { }
    );
  }

  addBanner(id: number) {
    const modalRef = this.modalService.open(AddBannersModalComponent, {size: 'xl'});
    modalRef.componentInstance.id = id;
   // modalRef.componentInstance.listCategoryParent = this.listCategoryParent;
    modalRef.result.then(
      () => this.bannerService.fetch(),
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
