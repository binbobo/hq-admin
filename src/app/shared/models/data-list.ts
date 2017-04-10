import { PagedParams, PagedResult, BasicService } from 'app/shared/models';
import { AlerterService } from "app/shared/services";
import { OnInit, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ActivatedRoute, Params } from '@angular/router';

export abstract class DataList<T> implements OnInit {

  protected route: ActivatedRoute;
  protected alerter: AlerterService;
  protected params: PagedParams;

  ngOnInit(): void {
    this.params.init();
    this.index = this.params.pageIndex;
    this.route.queryParams.subscribe((params: Params) => {
      Object.keys(this.params).forEach(key => {
        if (params[key] !== undefined && params[key] != this.params[key]) {
          this.index = 1;
          this.params[key] = params[key];
        }
      });
    });
    this.loadList();
  }

  constructor(
    injector: Injector,
    protected service: BasicService<T>
  ) {
    this.route = injector.get(ActivatedRoute);
    this.alerter = new AlerterService();
  }

  @ViewChild("detailModal")
  protected detailModal: ModalDirective;
  protected model: T;
  protected total: number = 0;
  protected index: number = 1;
  protected size: number = 10;
  protected loading: boolean;
  protected list: Array<T>;

  protected onPageChanged(event: { page: number, itemsPerPage: number }) {
    this.params.setPage(event.page, event.itemsPerPage);
    this.loadList();
  }

  protected loadList() {
    this.loading = true;
    this.list = null;
    this.service.getPagedList(this.params)
      .then(m => {
        this.loading = false;
        this.list = m.data;
        this.total = m.totalCount;
        this.params.save();
      })
      .catch(err => {
        this.alerter.error(err);
        this.loading = false;
      });
  }

  protected onLoadList() {
    this.params.setPage(1);
    this.loadList();
  }

  protected showModal(id: string): void {
    this.service.get(id)
      .then(log => {
        this.model = log;
        this.detailModal.show();
      })
      .catch(err => this.alerter.error(err))
  }

  protected onDelete($event: Event, id: string) {
    if (!confirm('确定要删除？')) return false;
    let el = $event.target as HTMLInputElement;
    el.disabled = true;
    this.service.delete(id)
      .then(() => {
        this.alerter.success('删除成功！');
        this.loadList();
      })
      .catch(err => {
        this.alerter.error(err);
        el.disabled = false;
      });
  }
}
