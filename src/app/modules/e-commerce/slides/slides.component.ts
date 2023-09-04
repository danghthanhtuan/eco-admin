// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../_services';
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
import { CategoriesService } from '../_services/categories.service';
import { environment } from 'src/environments/environment';
import { SlidesService } from '../_services/slides.service';
import { AddSlidesModalComponent } from './components/add-slides-modal.component';
import { DeleteSlidesModalComponent } from './components/delete-slides-modal.component';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: [],
})
export class SlidesComponent
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
    //public productsService: ProductsService,
    public slideService: SlidesService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    // this.getListCategoryParent();
    this.filterForm();
    this.searchForm();
    this.slideService.fetch();
    // const sb = this.slideService.isLoading$.subscribe(res => this.isLoading = res);
    // this.subscriptions.push(sb);
    this.grouping = this.slideService.grouping;
    this.paginator = this.slideService.paginator;
    this.sorting = this.slideService.sorting;
    //this.attributeService.fetch(); 
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  // getListCategoryParent(){
  //   this.slideService.getAllCategory()
  //   .subscribe(
  //     (res: any) => {
  //       this.listCategoryParent = res;
  //     }
  //   )
  //   //.subscribe();
  // }

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
    this.slideService.patchState({ filter });
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
    this.slideService.patchState({ searchTerm });
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
    this.slideService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.slideService.patchState({ paginator });
  }
  // actions

  delete(id: number) {
    const modalRef = this.modalService.open(DeleteSlidesModalComponent,);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.slideService.fetch(),
      () => { }
    );
  }

  addSlides(id: number) {
    const modalRef = this.modalService.open(AddSlidesModalComponent, { size: 'xl' });
    modalRef.componentInstance.id = id;
    // modalRef.componentInstance.listCategoryParent = this.listCategoryParent;
    modalRef.result.then(
      () => this.slideService.fetch(),
      () => { }
    );
  }

}
