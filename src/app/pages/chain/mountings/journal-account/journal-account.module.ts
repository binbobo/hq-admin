import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { MountingsListComponent } from './mountings-list/mountings-list.component';
import { AccountListComponent } from './account-list/account-list.component';
import { JournalAccountService } from './journal-account.service';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ChainSharedModule } from '../../chain-shared/chain-shared.module';

const routes: Routes = [
  { path: '', component: AccountListComponent }
];

@NgModule({
  imports: [
    SharedModule.forRoot(),
    ChainSharedModule,
    RouterModule.forChild(routes),
    NguiDatetimePickerModule,
  ],
  providers: [JournalAccountService],
  declarations: [MountingsListComponent, AccountListComponent]
})
export class JournalAccountModule { }
