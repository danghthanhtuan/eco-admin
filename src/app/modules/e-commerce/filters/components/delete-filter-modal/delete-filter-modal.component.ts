import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { ProductsService } from '../../../_services';
import { AttributesService } from '../../../_services/attributes.service';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';

@Component({
  selector: 'app-delete-filter-modal',
  templateUrl: './delete-filter-modal.component.html',
  styleUrls: []
})
export class DeleteFilterModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private attributeService: AttributesService, public modal: NgbActiveModal,
    private srvAlter : SwalService) { }

  ngOnInit(): void {
  }

  deleteFilter() {
    this.isLoading = true;
    const sb = this.attributeService.delete(this.id, 'v1/filter?id=').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
      catchError((err) => {
        this.modal.dismiss(err);
        return of(undefined);
      }),
      finalize(() => {
        this.isLoading = false;
        this.srvAlter.toast(TYPE.SUCCESS, "Xoá thành công!", false);
      })
    ).subscribe();
    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
