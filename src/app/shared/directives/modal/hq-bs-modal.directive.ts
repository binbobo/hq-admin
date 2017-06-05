import { Directive, Input } from '@angular/core';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap';

@Directive({
  selector: '[hqBsModal]',
  exportAs: 'hq-bs-modal'
})
export class HqBsModalDirective extends ModalDirective {

  protected getConfig(config?: ModalOptions): ModalOptions {
    return Object.assign({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true
    }, config);
  }

}
