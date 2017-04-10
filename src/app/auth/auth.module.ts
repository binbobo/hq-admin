import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule, routedComponents } from "app/auth/auth.routing";
import { AuthService } from './auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    HttpModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    AlertModule.forRoot()
  ],
  providers: [AuthService],
  declarations: [routedComponents]
})
export class AuthModule { }