import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DbLogComponent } from './db-log/db-log.component';
import { UsualLogComponent } from './usual-log/usual-log.component';
import { HttpLogComponent } from './http-log/http-log.component';

const routes: Routes = [
    { path: 'db', component: DbLogComponent },
    { path: 'http', component: HttpLogComponent },
    { path: 'usual', component: UsualLogComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LogsRoutingModule { }

export const routedComponents = [DbLogComponent, HttpLogComponent, UsualLogComponent];