import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConfigService } from './config.service';
import { ConfigComponent } from './config.component';
import { TreeModule } from 'ng2-tree';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: ConfigComponent }
]

@NgModule({
  imports: [
    SharedModule.forRoot(),
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TreeModule
  ],
  providers: [ConfigService],
  declarations: [ConfigComponent]
})
export class ConfigModule { }
