import { PagedParams, PagedResult } from 'app/shared/models';
import { OnInit, ViewChild, Injector } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HqAlerter } from 'app/shared/directives';
import { PagedService } from './basic-service.interface';

export abstract class DataList<T> implements OnInit {
  protected lazyLoad = false;
  protected route: ActivatedRoute;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  protected params: PagedParams;
  protected result: any;

  ngOnInit(): void {
    this.params.init();
    this.index = this.params.pageIndex;
    this.size = this.params.pageSize;
    this.route.queryParams.subscribe((params: Params) => {
      Object.keys(this.params).forEach(key => {
        if (params[key] !== undefined && params[key] !== this.params[key]) {
          this.index = 1;
          this.size = 10;
          this.params[key] = params[key];
        }
      });
    });
    if (!this.lazyLoad) {
      this.loadList();
    }
  }

  constructor(
    injector: Injector,
    protected service: PagedService<T>
  ) {
    this.route = injector.get(ActivatedRoute);
  }

  protected total: number = 0;
  protected index: number = 1;
  protected size: number = 10;
  protected loading: boolean;
  protected list: Array<T>;

  protected onPageChanged(event: { page: number, itemsPerPage: number }) {
    this.params.setPage(event.page, event.itemsPerPage);
    this.loadList();
  }

  protected onCheckChange($event: Event) {
    let el = $event.target as HTMLInputElement;
    this.list.forEach(m => m['checked'] = el.checked);
  }

  protected get selectedItems(): Array<T> {
    if (!this.list) return null;
    return this.list.filter(m => m['checked'] === true);
  }

  protected loadList() {
    this.loading = true;
    this.list = null;
    return this.service.getPagedList(this.params)
      .then(m => {
        this.loading = false;
        this.result = m;
        this.list = m.data;
        this.total = m.totalCount;
        this.params.save();
        return m;
      })
      .catch(err => {
        this.alerter.error(err);
        this.loading = false;
      });
  }

  protected onLoadList() {
    this.index = 1;
    this.params.setPage(1, this.size);
    this.loadList();
  }
}