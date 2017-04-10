import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'language', loadChildren: 'app/pages/locale/language/language.module#LanguageModule' },
    { path: 'resource', loadChildren: 'app/pages/locale/resource/resource.module#ResourceModule' },
    { path: 'group', loadChildren: 'app/pages/locale/group/group.module#GroupModule' },
    { path: 'property', loadChildren: 'app/pages/locale/property/property.module#PropertyModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LocaleRoutingModule { }