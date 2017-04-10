import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './config/config.component';

const routes: Routes = [
    { path: 'menu', loadChildren: 'app/pages/settings/menu/menu.module#MenuModule' },
    { path: 'config', component: ConfigComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule { }

export const routedComponents = [ConfigComponent];