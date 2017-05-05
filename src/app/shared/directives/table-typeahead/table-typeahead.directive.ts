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
  private valueSelector: string = 'id';
  @Input()
  private pageSize: number = 10;
  @Input()
  private multiple: boolean;
  @Output()
  private onSelect = new EventEmitter<any>();

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    let result = this.component.result;
    if (result && result.data && result.data.length) {
      setTimeout(() => this.component.hidden = true, 500);
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event) {
    let result = this.component.result;
    if (result && result.data && result.data.length) {
      this.component.hidden = false;
    }
  }

  private search(pageIndex = 1) {
    this.component.hidden = true;
    this.component.result = null;
    let el = this.el.nativeElement as HTMLInputElement;
    if (!el.value) {
      return;
    }
    let param = new TypeaheadRequestParams(el.value);
    param.setPage(pageIndex, this.pageSize);
    if (this.source) {
      this.source(param)
        .then(result => {
          this.component.hidden = false;
          this.component.result = result;
        })
        .catch(err => console.error(err));
    }
  }

  ngOnInit(): void {
    if (this.columns) {
      let selectedItem = this.columns.find(m => m.checked);
      if (this.valueSelector === 'id' && selectedItem) {
        this.valueSelector = selectedItem.name;
      }
    }
    let el = this.el.nativeElement as HTMLInputElement;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableTypeaheadComponent);
    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.component = (<TableTypeaheadComponent>componentRef.instance);
    this.component.columns = this.columns;
    this.component.onSelect = this.onSelect;
    this.component.size = this.pageSize;
    this.component.multiple = this.multiple;
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
        el.value = item[this.valueSelector];
      }
    })
  }
}

export class TableTypeaheadColumn {
  constructor(
    public name: string,
    public title?: string,
    public maxLength?: number,
    public checked?: boolean
  ) { }
}

export class TypeaheadRequestParams extends PagedParams {
  constructor(public text?: string) {
    super();
  }
}
