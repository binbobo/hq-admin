import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, EventEmitter, Output, OnInit, HostListener, ElementRef } from '@angular/core';
import { TableTypeaheadComponent } from './table-typeahead.component';
import { PagedResult, PagedParams } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Directive({
  selector: '[hqTableTypeahead]',
  exportAs: 'hq-table-typeahead'
})
export class TableTypeaheadDirective implements OnInit {

  private component: TableTypeaheadComponent;
  @Input("hqTableTypeahead")
  private source: (params: TypeaheadRequestParams) => Promise<PagedResult<any>>;
  @Input()
  private delay: number = 600;
  @Input()
  private columns: Array<TableTypeaheadColumn>;
  @Input()
  private pageSize: number = 10;
  @Input()
  private multiple: boolean;
  @Output()
  private onSelect = new EventEmitter<any>();
  @Output()
  private onRemove = new EventEmitter();

  private paging = false;
  private sortedKeys: Array<string> = [];

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    let result = this.component.result;
    if (!this.multiple && result && result.data && result.data.length) {
      setTimeout(() => {
        if (this.paging) {
          this.paging = false;
          let el = this.el.nativeElement as HTMLInputElement;
          el.focus();
        } else {
          this.component.hide();
        }
      }, 500);
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event) {
    this.component.show();
  }

  private search(pageIndex = 1) {
    let el = this.el.nativeElement as HTMLInputElement;
    if (!el.value) return;
    let param = new TypeaheadRequestParams(el.value);
    param.setPage(pageIndex, this.pageSize);
    if (this.source) {
      this.source(param)
        .then(result => {
          this.component.result = result;
          this.component.show();
        })
        .catch(err => console.error(err));
    }
  }

  ngOnInit(): void {
    if (this.columns) {
      this.sortedKeys = this.columns
        .slice(0)
        .sort((m, n) => {
          m.weight = m.weight || 0;
          n.weight = n.weight || 0;
          return m.weight === n.weight ? 0 : n.weight - m.weight
        })
        .map(m => m.name);
    }
    let el = this.el.nativeElement as HTMLInputElement;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableTypeaheadComponent);
    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.component = (<TableTypeaheadComponent>componentRef.instance);
    this.component.columns = this.columns;
    this.component.onSelect = this.onSelect;
    this.component.onRemove = this.onRemove;
    this.component.size = this.pageSize;
    this.component.multiple = this.multiple;
    this.component.onPageChange.subscribe(params => {
      this.paging = true;
      this.search(params.pageIndex);
    });
    Observable.fromEvent(this.el.nativeElement, 'input')
      .map((e: any) => e.target.value)
      .debounceTime(this.delay)
      .distinctUntilChanged()
      .subscribe(value => {
        this.component.hide();
        this.search();
      });
    this.onSelect.subscribe((item) => {
      let originValue = el.value;
      if (!this.multiple) {
        let selectedValue = this.sortedKeys
          .filter(key => item[key])
          .map(key => item[key].toString())
          .find(value => value.includes(originValue));
        if (selectedValue) {
          el.value = selectedValue;
        }
      }
    })
  }
}

export class TableTypeaheadColumn {
  constructor(
    public name: string,
    public weight: number = 0,
    public title?: string,
    public maxLength?: number,
  ) { }
}

export class TypeaheadRequestParams extends PagedParams {
  constructor(public text?: string) {
    super();
  }
}
