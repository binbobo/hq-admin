import { NgModule } from '@angular/core';
import { PagesRoutingModule, routedComponents } from 'app/pages/pages.routing';
import { AuthGuard } from 'app/auth/auth.guard';
import { BsDropdownModule, DatepickerModule, PopoverModule } from 'ngx-bootstrap';
import { SharedModule } from 'app/shared/shared.module';
import { LanguageService } from './locale/language/language.service';
import { MenuService } from './settings/menu/menu.service';
import { PagesService } from './pages.service';
import { NguiDatetimePickerModule, NguiDatetime  } from '@ngui/datetime-picker';

@NgModule({
  imports: [
    PagesRoutingModule,
    SharedModule,
    BsDropdownModule.forRoot(),
    NguiDatetimePickerModule,
    PopoverModule.forRoot(),
  ],
  providers: [AuthGuard, LanguageService, MenuService, PagesService],
  declarations: [routedComponents]
})
export class PagesModule { }
