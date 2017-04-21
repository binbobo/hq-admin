import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'menu', loadChildren: 'app/pages/settings/menu/menu.module#MenuModule' },
    { path: 'application', loadChildren: 'app/pages/settings/application/application.module#ApplicationModule' },
    { path: 'client', loadChildren: 'app/pages/settings/client/client.module#ClientModule' },
    { path: 'config', loadChildren: 'app/pages/settings/config/config.module#ConfigModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule { }