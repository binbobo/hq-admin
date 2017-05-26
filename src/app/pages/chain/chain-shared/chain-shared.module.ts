import { NgModule } from '@angular/core';
import { SuspendBillService } from './suspend-bill/suspend-bill.service';
import { SuspendBillComponent } from "./suspend-bill/suspend-bill.component";
import { SuspendBillDirective } from './suspend-bill/suspend-bill.directive';
import { BsDropdownModule } from 'ngx-bootstrap';
import { CustomerTypeaheadDirective } from './table-typeahead/customer-typeahead.directive';
import { SharedModule } from 'app/shared/shared.module';
import { ProductTypeaheadDirective } from './table-typeahead/product-typeahead.directive';
import { ProviderTypeaheadDirective } from './table-typeahead/provider-typeahead.directive';
import { VehicleTypeaheadDirective } from './table-typeahead/vehicle-typeahead.directive';
import { PlateNoTypeaheadDirective } from './table-typeahead/plateNo-typeahead.directive';
import { CustomerVehicleTypeaheadDirective } from './table-typeahead/customerVehicle-typeahead.directive';
import { BrandTypeaheadDirective } from './table-typeahead/brand-typeahead.directive';
import { StorageLocationTypeaheadDirective } from './table-typeahead/storage-location-typeahead.directive';
import { SeriesTypeaheadDirective } from './table-typeahead/series-typeahead.directive';
import { ModelTypeaheadDirective } from './table-typeahead/model-typeahead.directive';
import { MaintenanceItemTypeaheadDirective } from './table-typeahead/maintenance-item.typeahead.directive';
import { ProductCategoryTypeaheadDirective } from './table-typeahead/product-category-typeahead.directive';
import { ProductBrandTypeaheadDirective } from './table-typeahead/product-brand-typeahead.directive';

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
    VehicleTypeaheadDirective,
    PlateNoTypeaheadDirective,
    CustomerVehicleTypeaheadDirective,
    BrandTypeaheadDirective,
    SeriesTypeaheadDirective,
    ModelTypeaheadDirective,
    MaintenanceItemTypeaheadDirective,
    StorageLocationTypeaheadDirective,
    ProductCategoryTypeaheadDirective,
    ProductBrandTypeaheadDirective,
  ],
  declarations: [
    SuspendBillDirective,
    SuspendBillComponent,
    CustomerTypeaheadDirective,
    ProductTypeaheadDirective,
    ProviderTypeaheadDirective,
    VehicleTypeaheadDirective,
    PlateNoTypeaheadDirective,
    CustomerVehicleTypeaheadDirective,
    BrandTypeaheadDirective,
    SeriesTypeaheadDirective,
    ModelTypeaheadDirective,
    MaintenanceItemTypeaheadDirective,
    StorageLocationTypeaheadDirective,
    ProductCategoryTypeaheadDirective,
    ProductBrandTypeaheadDirective,
  ],
  providers: [SuspendBillService],
  entryComponents: [SuspendBillComponent]
})
export class ChainSharedModule { }
