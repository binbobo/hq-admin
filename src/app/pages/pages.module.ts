import { NgModule } from '@angular/core';
import { PagesRoutingModule, routedComponents } from "app/pages/pages.routing";
import { AuthGuard } from "app/auth/auth.guard";
import { BsDropdownModule } from "ngx-bootstrap";
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { LanguageService } from './locale/language/language.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    SharedModule,
    RouterModule,
    BsDropdownModule.forRoot()
  ],
  providers: [AuthGuard, LanguageService],
  declarations: [routedComponents]
})
export class PagesModule { }
