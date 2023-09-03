import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { AddProducutToTransModalComponent } from './add-product-to-trans-modal.component';
import { environment } from 'src/environments/environment';
import { TransactionsService } from '../../_services/transactions.service';

@Component({
  selector: 'app-transactions-modal',
  templateUrl: './transactions-modal.component.html',
  styleUrls: []
})
export class TransactionsModalComponent implements OnInit, OnDestroy {

  formGroup: FormGroup;
  @Input() id: number;
  @Input() transaction: any;
  public urlImage = environment.urlImage;
  isLoading = false;
  subscriptions: Subscription[] = [];
  constructor(public modal: NgbActiveModal,
    private fb: FormBuilder, private srvAlter: SwalService,
    private modalService: NgbModal,
    private transactionService: TransactionsService) { }

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      transactionID: [this.transaction.transactionID],
      orderCode: [this.transaction.orderCode],
      shippingName: [this.transaction.shippingName,],
      shippingPhone: [this.transaction.shippingPhone,],
      shippingAddress: [this.transaction.shippingAddress,],
      paymentType: [this.transaction.paymentType],
      totalAmount: [this.transaction.totalAmount],
      status: [this.transaction.status],
      createdDate: [this.transaction.createdDate],
    });

    this.isLoading = true;
  }

  edit() {
    var items : any = [];
    this.transaction.orderItems.forEach(element => {
      items.push( 
        {
          productID : element.productId,
          quantity : element.quantity
        }
      );
    });
    var modelPut : any = {
      paymentId : this.transaction.transactionID,
      status : this.formGroup.get("status").value,
      productOrderRequests : items
    }

    const sbUpdate = this.transactionService.update( modelPut, '/v1/payment/update-status').pipe(
      tap(( res: any) => {
        this.modal.close();
        this.checkSuccessEditOrAdd(res, "Cập nhật");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(errorMessage.error);
      }),
    ).subscribe();
    this.subscriptions.push(sbUpdate);
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  editProductItem(id: number, item: any) {
    const modalRef = this.modalService.open(AddProducutToTransModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.orderItem = item;
    modalRef.componentInstance.edit.subscribe(($value) => {
      this.transaction.orderItems.forEach(element => {
        if(element.productId == $value.productId)
        {
          element.quantity = $value.quantity;
        }
      });
    })
    modalRef.result.then(
      // () => this.tradeService.fetch(),
      () => { }
    );
  }

  deleteOrderItem(index: number) {
    if (this.transaction.orderItems && this.transaction.orderItems.length >= index) {
      this.transaction.orderItems.splice(index, 1);
    }
  }


  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  checkSuccessEditOrAdd(res: any, action: string) {
    if (res && res.statusCode === 200 && res.errorCode == 0) {
      this.srvAlter.toast(TYPE.SUCCESS, action + " thành công!", false);

    } else {
      this.srvAlter.toast(TYPE.ERROR, action + " không thành công!", false);
    }
  };

  getStatusName(status: number) {
    switch (status) {
      case 1: {
        return "Mới";
      }
      case 2: {
        return "Đang xử lý";
      }
      case 3: {
        return "Đang giao";
      }
      case 4: {
        return "Hoàn thành";
      }
      case 5: {
        return "Đã huỷ";
      }
      default: ""
    }
  }

  getTransTypeName(status: number) {
    switch (status) {
      case 1: {
        return "Tiền mặt";
      }
      case 2: {
        return "Chuyển khoản";
      }

      default: ""
    }
  }
}
