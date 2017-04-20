import { NgModule } from '@angular/core';
import { AppListComponent } from './app-list/app-list.component';
import { AppCreateComponent } from './app-create/app-create.component';
import { AppEditComponent } from './app-edit/app-edit.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

const routes: Routes = [
  { path: '', component: AppListComponent },
  { path: 'create', component: AppCreateComponent },
  { path: 'edit/:id', component: AppEditComponent },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppListComponent, AppCreateComponent, AppEditComponent]
})
export class ApplicationModule { }