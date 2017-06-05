import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyCreateComponent } from './property-create/property-create.component';
import { PropertyEditComponent } from './property-edit/property-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PropertyRoutingModule, routedComponents } from './property.routing';
import { PropertyService } from './property.service';
import { PropertyDetailResolver } from './property-detail-resolver.service';
import { LanguageService } from '../language/language.service';
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    PropertyRoutingModule,
  ],
  providers: [PropertyService, LanguageService, PropertyDetailResolver],
  declarations: [routedComponents]
})
export class PropertyModule { }
