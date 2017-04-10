import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule, routedComponents } from './settings.routing';
import { ConfigService } from './config/config.service';
import { TreeModule } from "ng2-tree";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SettingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule
  ],
  providers: [ConfigService],
  declarations: [routedComponents]
})
export class SettingsModule { }
