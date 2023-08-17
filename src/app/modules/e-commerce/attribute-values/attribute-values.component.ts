// tslint:disable:no-string-literal
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
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
import { AttributesService } from '../_services/attributes.service';
import { AttributeValueService } from '../_services/attribute-value.service';
import { AddAttributeValueModalComponent } from './components/add-attribute-value-modal/add-attribute-value-modal.component';

// import { DeleteProductsModalComponent } from './components/delete-products-modal/delete-products-modal.component';
// import { UpdateProductsStatusModalComponent } from './components/update-products-status-modal/update-products-status-modal.component';
// import { FetchProductsModalComponent } from './components/fetch-products-modal/fetch-products-modal.component';

@Component({
  selector: 'app-attribute-values',
  templateUrl: './attribute-values.component.html',
  styleUrls: [],
})
export class AttributeValuesComponent
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
  listAttributes : any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    //public productsService: ProductsService,
    public attributeValueService : AttributeValueService
  ) { }

  // angular lifecircle hooks
  ngOnInit(): void {
    this.getListAttribute();
    this.filterForm();
    this.searchForm();
    this.attributeValueService.fetch();
    const sb = this.attributeValueService.isLoading$.subscribe(res => this.isLoading = res);
    this.subscriptions.push(sb);
    this.grouping = this.attributeValueService.grouping;
    this.paginator = this.attributeValueService.paginator;
    //this.sorting = this.attributeValueService.sorting;
    //this.attributeService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getListAttribute(){
    this.attributeValueService.getAllAttribute()
    .subscribe(
      (res: any) => {
        this.listAttributes = res;
      }
    )
    //.subscribe();
  }

  // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      attribute: [''],
      condition: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.attribute.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.condition.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = {};
    const attribute = this.filterGroup.get('attribute').value;
    if (attribute) {
      filter['attribute'] = attribute;
    }

    // const condition = this.filterGroup.get('condition').value;
    // if (condition) {
    //   filter['condition'] = condition;
    // }
    this.attributeValueService.patchState({ filter });
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
    this.attributeValueService.patchState({ searchTerm });
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
    this.attributeValueService.patchState({ sorting });
  }

  // pagination
  paginate(paginator: PaginatorState) {
    this.attributeValueService.patchState({ paginator });
  }
  // actions
  
  // delete(id: number) {
  //   const modalRef = this.modalService.open(DeleteAttributeModalComponent, );
  //   modalRef.componentInstance.id = id;
  //   modalRef.result.then(
  //     () => this.attributeService.fetch(),
  //     () => { }
  //   );
  // }

  addAttributeValue(id: number) {
    const modalRef = this.modalService.open(AddAttributeValueModalComponent, {size: 'xl'});
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.listAttributes = this.listAttributes;
    modalRef.result.then(
      () => this.attributeValueService.fetch(),
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
