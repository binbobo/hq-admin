import { Component, OnInit, Injector } from '@angular/core';
import { JournalAccount, JournalAccountService, JournalAccountListRequest, JournalAcountType, JournalAccountListResponse } from '../journal-account.service';
import { DataList } from 'app/shared/models';

@Component({
  selector: 'hq-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent extends DataList<JournalAccount> implements OnInit {

  private item: any;
  protected params: JournalAccountListRequest;
  protected tags: Array<JournalAcountType> = [];

  constructor(
    injector: Injector,
    private accountService: JournalAccountService,
  ) {
    super(injector, accountService);
    this.params = new JournalAccountListRequest();
  }

  private onSelectItem(item) {
    this.item = item;
    this.params.productId = item.productId;
    this.loadList();
  }

  private onSelectTag(tag: JournalAcountType) {
    this.params.type = tag.type;
    this.tags = [];
    this.loadList();
  }

  private onExport($event: Event) {
    let el = $event.target as HTMLButtonElement;
    el.disabled = true;
    this.accountService.export(this.params)
      .then(() => el.disabled = false)
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  loadList() {
    return super.loadList()
      .then(result => {
        let resp = result as JournalAccountListResponse;
        this.tags = resp.tabList;
      })
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
