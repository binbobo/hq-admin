import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from './language.service';
import { routedComponents, LanguageRoutingModule } from './language.routing';
import { LanguageDetailResolver } from './language-detail-resolver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LanguageRoutingModule,
  ],
  providers: [LanguageService, LanguageDetailResolver],
  declarations: [routedComponents]
})
export class LanguageModule { }
