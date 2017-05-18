import { NgModule } from '@angular/core';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ClientDetailResolver } from './client-detail-resolver.service';
import { ClientCreateComponent } from './client-create/client-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from './client.service';
import { ApplicationService } from '../application/application.service';

const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'create', component: ClientCreateComponent },
  { path: 'edit/:id', component: ClientEditComponent, resolve: ClientDetailResolver }
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [ClientService, ApplicationService, ClientDetailResolver],
  declarations: [ClientListComponent, ClientCreateComponent, ClientEditComponent]
})
export class ClientModule { }
