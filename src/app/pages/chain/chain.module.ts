import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainRoutingModule } from './chain.routing';
import { ChainService } from "./chain.service";

@NgModule({
  imports: [
    ChainRoutingModule, 
  ],
  declarations: [],
  providers: [ChainService],
})
export class ChainModule { }
