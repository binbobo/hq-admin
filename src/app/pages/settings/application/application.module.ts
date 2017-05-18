import { NgModule } from '@angular/core';
import { AppListComponent } from './app-list/app-list.component';
import { AppCreateComponent } from './app-create/app-create.component';
import { AppEditComponent } from './app-edit/app-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationService } from './application.service';
import { AppDetailResolverService } from './app-detail-resolver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: AppListComponent },
  { path: 'create', component: AppCreateComponent },
  { path: 'edit/:id', component: AppEditComponent, resolve: { model: AppDetailResolverService } },
];

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [ApplicationService, AppDetailResolverService],
  declarations: [AppListComponent, AppCreateComponent, AppEditComponent]
})
export class ApplicationModule { }