import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { SpecificationsService } from '../../../../_services';
import { ProductImagesService } from 'src/app/modules/e-commerce/_services/product-images.service';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';

@Component({
  selector: 'app-delete-spec-modal',
  templateUrl: './delete-spec-modal.component.html',
  styleUrls: ['./delete-spec-modal.component.scss']
})
export class DeleteSpecModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private specsService: ProductImagesService, public modal: NgbActiveModal,
    private srvAlter: SwalService
    
    ) { }

  ngOnInit(): void {
  }

  deleteSpec() {
    this.isLoading = true;
    const sb = this.specsService.delete(this.id, '/v1/ProductImage?id=').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap((res :any) => {
        this.checkSuccessEditOrAdd(res, "Xoá hình ảnh");
        this.modal.close()
      
      }),
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

  checkSuccessEditOrAdd(res: any, action : string){
    if(res && res.statusCode === 200 && res.errorCode == 0){
      this.srvAlter.toast(TYPE.SUCCESS, action + " thành công!", false);

    }else{
      this.srvAlter.toast(TYPE.ERROR, action + " không thành công!", false);
    }
  };
}
