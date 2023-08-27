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

@Component({
  selector: 'app-add-slides-modal',
  templateUrl: './add-slides-modal.component.html',
  styleUrls: []
})
export class AddSlidesModalComponent implements OnInit, OnDestroy {
  EMPTY_Attribute_Value : any = {
    id: undefined,
    name : '',
    target: '',
    sortOrder : 0,
    imageUrl: '',
    status : 0
  }

  formGroup: FormGroup;
  @Input() id: number;
  //@Input() listCategoryParent: any;
  slide: Slide = {
    id: undefined,
    name : '',
    target: '',
    sortOrder : 0,
    imageUrl: '',
    status : 0
  };
  isLoading = false;
  subscriptions: Subscription[] = [];
  public fileReview : any;
  public urlImage = environment.urlImage;
  constructor(private slideService: SlidesService, public modal: NgbActiveModal,
  private fb: FormBuilder,private srvAlter: SwalService) { }
   
  ngOnInit(): void {  
    this.loadSlide();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      target: [this.slide.target, Validators.compose([ Validators.minLength(1), Validators.maxLength(200)])],
      sortOrder: [this.slide.sortOrder],
         file : new FormControl(''),
         imageUrl : new FormControl('', Validators.required)
    });

    this.isLoading = true;
  }

  deleteAttribute() {
    this.isLoading = true;
    const sb = this.slideService.delete(this.id, '').pipe(
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
     modelPost.append('Url',   this.slide.target);
     modelPost.append('SortOrder', this.slide.sortOrder.toString());
 
    const sb = this.slideService.createWithImage(modelPost, '/v1/slides').pipe(
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
        this.slideService.fetch();
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
    modelUpdate.append('Target',   this.slide.target);
    modelUpdate.append('SortOrder', this.slide.sortOrder.toString());

    const sbUpdate = this.slideService.updateWithImage(modelUpdate, '/v1/category').pipe(
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
      const sb = this.slideService.getItemById(this.id, '/v1/slide/by-id?id=').pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(this.EMPTY_Attribute_Value);
        })
      ).subscribe((att: any) => {
        // this.slide = {
        //   id:  att.data.id,
          // categoryName : att.data.categoryName,
          // status:  att.data.status,
          // categoryParent : att.data.categoryParent,
          // seoDescription : att.data.seoDescription ?? '',
          // sortOrder : att.data.sortOrder,
          // seoTitle : att.data.seoTitle ?? '',
          // categoryTags : att.data.categoryTags ?? '',
          // content :  att.data.content ?? '',
          // imageUrl: att.data.imageUrl ?? '',
          // seoKeyword: att.data.seoKeyword ?? ''
        //};
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
    this.slide.target = formData.target;
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
