import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuCreateComponent } from './menu-create/menu-create.component';
import { MenuEditComponent } from './menu-edit/menu-edit.component';
import { MenuDetailResolver } from './menu-detail-resolver.service';
import { MenuService } from './menu.service';

const routes: Routes = [
    { path: '', component: MenuListComponent },
    { path: 'create', component: MenuCreateComponent },
    { path: 'edit/:id', component: MenuEditComponent, resolve: { model: MenuDetailResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MenuRoutingModule { }

export const routedComponents = [MenuListComponent, MenuCreateComponent, MenuEditComponent];