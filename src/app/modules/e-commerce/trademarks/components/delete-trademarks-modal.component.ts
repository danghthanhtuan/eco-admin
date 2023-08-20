import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { SlidesService } from '../../_services/slides.service';
import { TrademarksService } from '../../_services/trademarks.service';

@Component({
  selector: 'app-delete-trademarks-modal',
  templateUrl: './delete-trademarks-modal.component.html',
  styleUrls: []
})
export class DeleteTrademarksModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];
  constructor(private trademarksService: TrademarksService, public modal: NgbActiveModal,
    private srvAlter : SwalService) { }

  ngOnInit(): void {
  }

  deleteTrademarks() {
    this.isLoading = true;
    const sb = this.trademarksService.delete(this.id, '/v1/trademark?id=').pipe(
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
