import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { RemarksService } from '../../../../_services';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';

@Component({
  selector: 'app-delete-remark-modal',
  templateUrl: './delete-remark-modal.component.html',
  styleUrls: ['./delete-remark-modal.component.scss']
})
export class DeleteRemarkModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private remraksService: RemarksService, public modal: NgbActiveModal,
    private srvAlter: SwalService) { }

  ngOnInit(): void {
  }

  deleteRemark() {
    this.isLoading = true;
    const sb = this.remraksService.delete(this.id, '/v1/Product/review?idReview=').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap((res: any) => 
      {
        this.checkSuccessEditOrAdd(res, "Xoá");
        this.modal.close()
        
      }
      )
      
      ,
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  checkSuccessEditOrAdd(res: any, action: string) {
    if (res && res.statusCode === 200 && res.errorCode == 0) {
      this.srvAlter.toast(TYPE.SUCCESS, action + " thành công!", false);

    } else {
      if (res && res.statusCode === 400) {
        this.srvAlter.toast(TYPE.ERROR, res.errorMessage, false);
      } else
        this.srvAlter.toast(TYPE.ERROR, action + " không thành công!", false);
    }
  };
}
