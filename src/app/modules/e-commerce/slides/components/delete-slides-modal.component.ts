import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { SlidesService } from '../../_services/slides.service';

@Component({
  selector: 'app-delete-slides-modal',
  templateUrl: './delete-slides-modal.component.html',
  styleUrls: []
})
export class DeleteSlidesModalComponent implements OnInit, OnDestroy {

  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];
  totalUseAttributeValue : number = 0;
  constructor(private slidesService: SlidesService, public modal: NgbActiveModal,
    private srvAlter : SwalService) { }

  ngOnInit(): void {
  }

  deleteSlides() {
    this.isLoading = true;
    const sb = this.slidesService.delete(this.id, '/v1/slides?id=').pipe(
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
