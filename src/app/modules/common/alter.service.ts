import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

export enum TYPE {
    ERROR='error',
    SUCCESS='success',
    WARNING='warning',
    INFO='info',
    QUESTION='question'
  }

@Injectable({
    providedIn: 'root'
})
export class SwalService {
    constructor() { }
    Swal(
        text?: string,
        title?: string,
        icon?: SweetAlertIcon,
        confirmButtonText?: string,
        target?: any,
        cancelButtonText?: string,
        showCancelButton?: boolean,
    ): Promise<SweetAlertResult> {
        const options: SweetAlertOptions = {
            text,
            title,
            icon,
            confirmButtonText,
            target,
            cancelButtonText,
            showCancelButton
        };
        return Swal.fire(options);
    }

    toast(typeIcon : TYPE, text: string, timerProgressBar: boolean = false) {
       return Swal.fire({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          icon: typeIcon,
          timerProgressBar,
          timer: 2200,
          title: "<h6 style='color:#3378b9'>" + text + "</h6>"
        })
      }  
}

