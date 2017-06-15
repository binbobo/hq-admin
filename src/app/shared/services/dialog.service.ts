import { Injectable } from '@angular/core'
import { assign } from 'lodash';
import sweetalert from 'sweetalert2';

@Injectable()
export class DialogService {
  // 通用基础配置
  private commonOptions = {
    width: '350px',
    confirmButtonClass: 'btn-primary btn-sm',
    cancelButtonClass: 'btn-secondary btn-sm',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    allowOutsideClick: false,
    animation: false
  };

  constructor() {
  }

  prompt(options) {
    let baseOptions: any = {
      showCancelButton: true,
      confirmButtonText: '提交',
      input: 'text'
    };
    return sweetalert(assign(baseOptions, options));
  }

  confirm(options, confirmCB: () => void, cancelCB?: () => void) {
    let baseOptions: any = {
      showCancelButton: true,
      showCloseButton: true,
      type: 'question',
    };
    assign(baseOptions, this.commonOptions);
    if (typeof options === "string") {
      baseOptions.text = options;
    } else if (typeof options === "object") {
      assign(baseOptions, options)
    }
    return sweetalert(baseOptions).then(confirmCB, () => {
      if (cancelCB) {
        cancelCB();
      }
    });
  }


  alert(options, confirmCB?: () => void) {
    const baseOptions: any = {
      type: 'info',
    };
    assign(baseOptions, this.commonOptions);
    if (typeof options === "string") {
      baseOptions.text = options;
    } else if (typeof options === "object") {
      assign(baseOptions, options)
    }
    return sweetalert(baseOptions).then(() => {
      if (confirmCB) {
        confirmCB();
      }
    });
  }
}