import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, EventEmitter, Output, OnInit, HostListener, ElementRef } from '@angular/core';
import { TableTypeaheadComponent } from './table-typeahead.component';
import { PagedResult, PagedParams } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Directive({
  selector: '[hq-table-typeahead]'
})
export class TableTypeaheadDirective implements OnInit {

  private component: TableTypeaheadComponent;
  @Input("hq-table-typeahead")
  private source: (params: TypeaheadRequestParams) => Promise<PagedResult<any>>;
  @Input()
  private delay: number = 600;
  @Input()
  private columns: Array<TableTypeaheadColumn>;
  @Input()
  private valueSelector: string = 'id';
  @Input()
  private pageSize: number = 10;
  @Output()
  private onSelect = new EventEmitter<any>();

  @HostListener('window:scroll', ['$event'])
  setPosition(event?) {
    let el = this.el.nativeElement as HTMLInputElement;
    let rect = el.getClientRects().item(0);
    this.component.top = rect.bottom + rect.height + 4;
    this.component.left = rect.left;
  }

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  private search(pageIndex = 1) {
    let el = this.el.nativeElement as HTMLInputElement;
    if (!el.value) {
      this.component.result = null;
      return;
    }
    let param = new TypeaheadRequestParams(el.value);
    param.setPage(pageIndex, this.pageSize);
    if (this.source) {
      this.source(param)
        .then(result => {
          this.component.result = result;
        })
        .catch(err => console.error(err));
    }
  }

  ngOnInit(): void {
    let el = this.el.nativeElement as HTMLInputElement;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableTypeaheadComponent);
    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.component = (<TableTypeaheadComponent>componentRef.instance);
    this.component.columns = this.columns;
    this.component.onSelect = this.onSelect;
    this.component.size = this.pageSize;
    this.setPosition();
    this.component.onPageChange.subscribe(params => {
      this.search(params.pageIndex);
    });
    Observable.fromEvent(this.el.nativeElement, 'input')
      .map((e: any) => e.target.value)
      .debounceTime(this.delay)
      .distinctUntilChanged()
      .subscribe(value => this.search());
    this.onSelect.subscribe((item) => {
      if (this.valueSelector) {
        let val = item[this.valueSelector];
        el.value = val;
      }
    })
  }
}

export class TableTypeaheadColumn {
  constructor(
    public name: string,
    public title?: string,
    public maxLength?: number,
  ) { }
}

export class TypeaheadRequestParams extends PagedParams {
  constructor(public text?: string) {
    super();
  }
}
