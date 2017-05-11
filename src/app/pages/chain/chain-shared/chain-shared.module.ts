import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuspendBillsService } from './suspend-bill/suspend-bill.service';
import { SuspendBillComponent } from "./suspend-bill/suspend-bill.component";
import { SuspendBillDirective } from './suspend-bill/suspend-bill.directive';
import { BsDropdownModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    SuspendBillDirective
  ],
  declarations: [SuspendBillDirective, SuspendBillComponent],
  providers: [SuspendBillsService],
  entryComponents: [SuspendBillComponent]
})
export class ChainSharedModule { }
