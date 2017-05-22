import { NgModule } from '@angular/core';
import { SuspendBillsService } from './suspend-bill/suspend-bill.service';
import { SuspendBillComponent } from "./suspend-bill/suspend-bill.component";
import { SuspendBillDirective } from './suspend-bill/suspend-bill.directive';
import { BsDropdownModule } from 'ngx-bootstrap';
import { CustomerTypeaheadDirective } from './table-typeahead/customer-typeahead.directive';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeaheadDirective } from './table-typeahead/product-typeahead.directive';
import { ProviderTypeaheadDirective } from './table-typeahead/provider-typeahead.directive';
import { VehicleTypeaheadDirective } from './table-typeahead/vehicle-typeahead.directive';

@NgModule({
  imports: [
    SharedModule,
    BsDropdownModule.forRoot(),
  ],
  exports: [
    SuspendBillDirective,
    CustomerTypeaheadDirective,
    ProductTypeaheadDirective,
    ProviderTypeaheadDirective,
    VehicleTypeaheadDirective
  ],
  declarations: [
    SuspendBillDirective,
    SuspendBillComponent,
    CustomerTypeaheadDirective,
    ProductTypeaheadDirective,
    ProviderTypeaheadDirective,
    VehicleTypeaheadDirective],
  providers: [SuspendBillsService],
  entryComponents: [SuspendBillComponent]
})
export class ChainSharedModule { }
