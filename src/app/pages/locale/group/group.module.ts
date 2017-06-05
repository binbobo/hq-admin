import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRoutingModule, routedComponents } from './group.routing';
import { GroupService } from './group.service';
import { GroupDetailResolver } from './group-detail-resolver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ServerTranslateLoader } from 'app/shared/services';

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    GroupRoutingModule,
  ],
  providers: [GroupService, GroupDetailResolver],
  declarations: [routedComponents]
})
export class GroupModule { }
