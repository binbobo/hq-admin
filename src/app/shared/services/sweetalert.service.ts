import { Injectable } from '@angular/core'
import { assign } from 'lodash';
import sweetalert from 'sweetalert2';

@Injectable()
export class SweetAlertService {
  constructor() {
  }

  prompt(options) {
    const baseOptions = {
      showCancelButton: true,
      confirmButtonText: '提交',
      input: 'text'
    };
    return sweetalert(assign(baseOptions, options));
  }

  confirm(options) {
    const baseOptions = {
      width: '350px',
      confirmButtonClass: 'btn-primary btn-sm',
      cancelButtonClass: 'btn-secondary btn-sm',
      // imageClass: "img-fluid",
      // imageWidth: 16,
      // imageHeight: 16,

      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'question',
      allowOutsideClick: false
    };
    return sweetalert(assign(baseOptions, options));
  }

  alert(options) {
    const baseOptions = {
      confirmButtonText: '确定',
      type: 'info',
      allowOutsideClick: false,
      animation: false
    };
    return sweetalert(assign(baseOptions, options));
  }
}