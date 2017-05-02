import { Component, OnInit, Injector } from '@angular/core';
import { JournalAccount, JournalAccountService, JournalAccountListRequest } from '../journal-account.service';
import { DataList } from 'app/shared/models';

@Component({
  selector: 'hq-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent extends DataList<JournalAccount> implements OnInit {

  private item: any;

  constructor(
    injector: Injector,
    private accountService: JournalAccountService,
  ) {
    super(injector, accountService);
    this.params = new JournalAccountListRequest();
  }

  private onSelectItem(item) {
    this.item = item;
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
