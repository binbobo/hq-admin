import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguageCreateComponent } from './language-create/language-create.component';
import { LanguageEditComponent } from './language-edit/language-edit.component';
import { LanguageListComponent } from './language-list/language-list.component';
import { LanguageDetailResolver } from './language-detail-resolver.service';

const routes: Routes = [
    { path: '', component: LanguageListComponent },
    { path: 'create', component: LanguageCreateComponent },
    { path: 'edit/:id', component: LanguageEditComponent, resolve: { model: LanguageDetailResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LanguageRoutingModule { }

export const routedComponents = [LanguageListComponent, LanguageCreateComponent, LanguageEditComponent];