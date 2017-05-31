import { NgModule } from '@angular/core';
import { PagesRoutingModule, routedComponents } from 'app/pages/pages.routing';
import { AuthGuard } from 'app/auth/auth.guard';
import { BsDropdownModule, DatepickerModule, PopoverModule, TypeaheadModule } from 'ngx-bootstrap';
import { SharedModule } from 'app/shared/shared.module';
import { LanguageService } from './locale/language/language.service';
import { MenuService } from './settings/menu/menu.service';
import { PagesService } from './pages.service';
import { NguiDatetimePickerModule, NguiDatetime } from '@ngui/datetime-picker';
import { OrganizationService } from './organization.service';
import { EmployeeService } from './employee.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    SharedModule,
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    NguiDatetimePickerModule,
    PopoverModule.forRoot(),
  ],
  providers: [AuthGuard, LanguageService, MenuService, PagesService, OrganizationService, EmployeeService],
  declarations: [routedComponents]
})
export class PagesModule { }
