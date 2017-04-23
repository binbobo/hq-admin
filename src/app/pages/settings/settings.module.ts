import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings.routing';
import { ConfigService } from './config/config.service';
import { TreeModule } from "ng2-tree";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SettingsRoutingModule,
  ],
  declarations: []
})
export class SettingsModule { }
