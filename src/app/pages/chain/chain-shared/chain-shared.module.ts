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
import { VehicleShowDirective, VehicleShowComponent } from './vehicle-show';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AttachmentItemListComponent, SuggestedItemListComponent, MaintenanceItemListComponent, MaintenanceFixingsListComponent } from './maintenance-item-list';
import { WorkshopSearchFormComponent, WorkshopOrderOperationComponent } from './workshop';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaymentShowComponent } from './payment-show/payment-show.component';
import { PaymentShowDirective } from './payment-show/payment-show.directive';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot()
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
    VehicleShowDirective,
    PaymentShowDirective,
    AttachmentItemListComponent,
    SuggestedItemListComponent,
    MaintenanceItemListComponent,
    MaintenanceFixingsListComponent,
    WorkshopSearchFormComponent,
    WorkshopOrderOperationComponent
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
    VehicleShowDirective,
    VehicleShowComponent,
    AttachmentItemListComponent,
    SuggestedItemListComponent,
    MaintenanceItemListComponent,
    MaintenanceFixingsListComponent,
    WorkshopSearchFormComponent,
    WorkshopOrderOperationComponent,
    PaymentShowComponent,
    PaymentShowDirective,
  ],
  providers: [SuspendBillService],
  entryComponents: [SuspendBillComponent, VehicleShowComponent, PaymentShowComponent]
})
export class ChainSharedModule { }
