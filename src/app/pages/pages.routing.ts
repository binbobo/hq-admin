import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from "app/auth/auth.guard";

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'logs', loadChildren: 'app/pages/logs/logs.module#LogsModule' },
            { path: 'settings', loadChildren: 'app/pages/settings/settings.module#SettingsModule' },
            { path: 'locale', loadChildren: 'app/pages/locale/locale.module#LocaleModule' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: []
})
export class PagesRoutingModule { }

export const routedComponents = [PagesComponent, HomeComponent];