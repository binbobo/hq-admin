import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResourceRoutingModule, routedComponents } from './resource.routing';
import { ResourceService } from './resource.service';
import { ResourceDetailResolver } from './resource-detail-resolver.service';
import { LanguageService } from '../language/language.service';
import { GroupService } from '../group/group.service';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ResourceRoutingModule,
  ],
  providers: [ResourceService, LanguageService, GroupService, ResourceDetailResolver],
  declarations: [routedComponents]
})
export class ResourceModule { }
