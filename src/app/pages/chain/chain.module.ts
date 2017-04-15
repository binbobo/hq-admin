import { NgModule } from '@angular/core';
import { ChainRoutingModule } from './chain.routing';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    ChainRoutingModule,
    SharedModule
  ],
  declarations: []
})
export class ChainModule { }
