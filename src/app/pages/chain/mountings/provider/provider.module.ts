import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderCreateComponent } from './provider-create/provider-create.component';
import { ProviderEditComponent } from './provider-edit/provider-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProviderService } from './provider.service';

const routes: Routes = [
  { path: '', component: ProviderListComponent },
  { path: 'create', component: ProviderCreateComponent },
  { path: 'edit/:id', component: ProviderEditComponent },
]

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [ProviderService],
  declarations: [ProviderListComponent, ProviderCreateComponent, ProviderEditComponent]
})
export class ProviderModule { }
