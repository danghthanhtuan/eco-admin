import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  GroupingState,
  ICreateAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IEditAction,
  IFetchSelectedAction,
  IGroupingView,
  ISearchView,
  ISortView,
  PaginatorState,
  SortState,
} from '../../../../../_metronic/shared/crud-table';
import { SPECIFICATIONS_DICTIONARY } from '../../../_models/specification.dictionary';
import { SpecificationsService } from '../../../_services';
import { DeleteSpecModalComponent } from './delete-spec-modal/delete-spec-modal.component';
import { DeleteSpecsModalComponent } from './delete-specs-modal/delete-specs-modal.component';
import { EditSpecModalComponent } from './edit-spec-modal/edit-spec-modal.component';
import { FetchSpecsModalComponent } from './fetch-specs-modal/fetch-specs-modal.component';
import { environment } from 'src/environments/environment';
import { ProductImagesService } from '../../../_services/product-images.service';

@Component({
  selector: 'app-specifications',
  templateUrl: './specifications.component.html',
  styleUrls: [],
})
export class SpecificationsComponent
  implements
    OnInit,
    OnDestroy,
    IDeleteAction,
    IDeleteSelectedAction,
    IFetchSelectedAction,
    ISortView,
    IGroupingView,
   // ISearchView,
    IEditAction,
    ICreateAction {
  @Input() productId: number;
  @Input() productImages: any;
  specs: string[] = SPECIFICATIONS_DICTIONARY;
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  urlImage = environment.urlImage;
  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public specsService: ProductImagesService
  ) {}

  ngOnInit(): void {
    const sb = this.specsService.isLoading$.subscribe(
      (res) => (this.isLoading = res)
    );
    this.subscriptions.push(sb);
    this.specsService.patchState({ entityId: this.productId });
    this.grouping = this.specsService.grouping;
    this.paginator = this.specsService.paginator;
    this.sorting = this.specsService.sorting;
    //this.specsService.fetch();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  //
 
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
    this.specsService.patchState({ sorting });
  }
  // pagination
  paginate(paginator: PaginatorState) {
    this.specsService.patchState({ paginator });
  }
  // actions
  delete(id: number) {
    const modalRef = this.modalService.open(DeleteSpecModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => this.specsService.fetch(),
      () => {}
    );
  }

  deleteSelected() {
    const modalRef = this.modalService.open(DeleteSpecsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.specsService.fetch(),
      () => {}
    );
  }

  fetchSelected() {
    const modalRef = this.modalService.open(FetchSpecsModalComponent);
    modalRef.componentInstance.ids = this.grouping.getSelectedRows();
    modalRef.result.then(
      () => this.specsService.fetch(),
      () => {}
    );
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(EditSpecModalComponent, {size : 'lg'});
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.productId = this.productId;
    modalRef.result.then(() =>
      this.specsService.fetch(),
      () => {}
    );
  }

  create(): void {
    this.edit(undefined);
  }
}
