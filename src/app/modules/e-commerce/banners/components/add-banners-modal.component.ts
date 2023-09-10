import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, first, tap } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalService, TYPE } from 'src/app/modules/common/alter.service';
import { CommonModule } from '@angular/common';  
import { environment } from 'src/environments/environment';
import { Slide } from '../../_models/slides.model';
import { SlidesService } from '../../_services/slides.service';
import { TrademarksService } from '../../_services/trademarks.service';
import { Trademarks } from '../../_models/trademarks.model';
import { Banners } from '../../_models/banner.model';

@Component({
  selector: 'app-add-banners-modal',
  templateUrl: './add-banners-modal.component.html',
  styleUrls: []
})
export class AddBannersModalComponent implements OnInit, OnDestroy {
  EMPTY_Banner_Value : any = {
    id: undefined,
    name : '',
    url: '',
    sortOrder : 0,
    imageUrl: '',
  }

  formGroup: FormGroup;
  @Input() id: number;
  //@Input() listCategoryParent: any;
  banner: Banners = {
    id: undefined,
    nameBanner : '',
    urlTarget: '',
    pathImage : '',
    status: 0,
    position: '0',
    productId: 0
  };
  isLoading = false;
  subscriptions: Subscription[] = [];
  public fileReview : any;
  public urlImage = environment.urlImage;
  constructor(private tradeMarksService: TrademarksService, public modal: NgbActiveModal,
  private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {  
    this.loadSlide();
  }

  loadForm() {
    // Validators.compose([ Validators.minLength(1), Validators.maxLength(200)])

    this.formGroup = this.fb.group({
      urlTarget: [this.banner.nameBanner, ],
      nameBanner: [this.banner.nameBanner],
      status: [this.banner.status],
         file : new FormControl(''),
         imageUrl : new FormControl('', Validators.required)
    });

    this.isLoading = true;
  }

  deleteBanner() {
    this.isLoading = true;
    const sb = this.tradeMarksService.delete(this.id, '').pipe(
      delay(1000), // Remove it from your code (just for showing loading)
      tap(() => this.modal.close()),
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

  AddSlide() {
    this.isLoading = true;
    var modelPost = new FormData ();
     modelPost.append('ImageUrl', this.formGroup.get('imageUrl').value);
     modelPost.append('Url',   this.banner.url);
     modelPost.append('SortOrder', this.banner.sortOrder.toString());
 
    const sb = this.tradeMarksService.createWithImage(modelPost, '/v1/trademark').pipe(
      delay(500), // Remove it from your code (just for showing loading)
      tap((res: any) =>
      {  
        this.checkSuccessEditOrAdd(res, "Thêm");     
        this.modal.close(); // thêm thành công thêm nữa ko close
      }
      ),
      catchError((err) => {
        this.modal.dismiss(err);
        this.srvAlter.toast(TYPE.ERROR, "Thêm không thành công!", false);
        return of(undefined);
      }),
      finalize(() => {
        //this.isLoading = false;
        // tính sau 
        this.tradeMarksService.fetch();
      })
    ).subscribe(
      );
    this.subscriptions.push(sb);
  }

  edit() {
    this.isLoading = true;
    var modelUpdate = new FormData ();
    modelUpdate.append('ID',   this.slide.id.toString());
    modelUpdate.append('ImageUrl', this.formGroup.get('imageUrl').value);
    modelUpdate.append('Url',   this.slide.url);
    modelUpdate.append('SortOrder', this.slide.sortOrder.toString());

    const sbUpdate = this.tradeMarksService.updateWithImage(modelUpdate, '/v1/trademark').pipe(
      tap((res : any) => {
        this.modal.close();
        this.checkSuccessEditOrAdd( res, "Cập nhật");
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.slide);
      }),
    ).subscribe(res => this.slide = res);
    this.subscriptions.push(sbUpdate);
  }

  loadSlide() {
    if (!this.id) {
      this.slide = this.EMPTY_Attribute_Value;
      this.loadForm();
    } else {
      const sb = this.tradeMarksService.getItemById(this.id, '/v1/trademark/by-id?id=').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.EMPTY_Attribute_Value);
        })
      ).subscribe((att: any) => {
        if(att.data.imageUrl && att.data.imageUrl !== ''){
          this.fileReview = this.urlImage + att.data.imageUrl;
        }
        
        this.loadForm();
      });
      this.subscriptions.push(sb);
    }
  }

  onFileChange(event) { 
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formGroup.get('imageUrl').setValue(file);;

      const reader = new FileReader();
        reader.onload = e => this.fileReview = reader.result;
        reader.readAsDataURL(file);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  save() {
    this.prepareAttribute();
    if (!this.formGroup.valid) {
      this.validateAllFormFields(this.formGroup);
      return;
    }

    if (this.slide.id) {
      this.edit();
    } else {
      this.AddSlide();
    }
  }

  private prepareAttribute() {
    const formData = this.formGroup.value;
    this.slide.url = formData.target;
    this.slide.sortOrder = formData.sortOrder;
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

  checkSuccessEditOrAdd(res: any, action : string){
    if(res && res.statusCode === 200 && res.errorCode == 0){
      this.srvAlter.toast(TYPE.SUCCESS, action + " thành công!", false);

    }else{
      this.srvAlter.toast(TYPE.ERROR, action + " không thành công!", false);
    }
  };
}
