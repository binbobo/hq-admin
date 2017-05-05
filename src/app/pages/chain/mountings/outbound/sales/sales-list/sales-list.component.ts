import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter } from 'app/shared/directives';
import { SalesListItem, SalesService } from '../sales.service';
import { SelectOption } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'hq-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {

  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  private salesmen: Array<SelectOption>;
  private items: Array<SalesListItem> = [];

  constructor(
    private salesService: SalesService
  ) { }

  ngOnInit() {
    this.salesService.getSalesmanOptions()
      .then(data => this.salesmen = data)
      .catch(err => this.alerter.error(err));
  }

  onCreate(event: SalesListItem) {
    this.items.push(event);
    this.createModal.hide();
  }
}
