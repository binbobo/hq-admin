import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, EventEmitter, Output, OnInit, HostListener, ElementRef, Component, ComponentRef } from '@angular/core';
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
  @Output()
  private notFound = new EventEmitter();

  private el: HTMLInputElement;
  private componentRef: ComponentRef<TableTypeaheadComponent>;
  private paging = false;
  private sortedKeys: Array<string> = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.el = this.viewContainerRef.element.nativeElement;
  }

  @HostListener('blur', ['$event'])
  onBlur(event) {
    if (!this.multiple) {
      setTimeout(() => {
        if (this.paging) {
          this.paging = false;
          this.el.focus();
        } else {
          this.hide();
        }
      }, 500);
    }
  }

  @HostListener('focus', ['$event'])
  onFocus(event) {
    this.show();
    !this.componentRef.instance.result && this.search();
  }

  show() {
    let rect = this.el.getBoundingClientRect();
    let ne = this.componentRef.location.nativeElement;
    ne.style.top = rect.height + "px";
    ne.style.left = "-2px";
    this.componentRef.instance.show();
  }

  hide() {
    this.componentRef.instance.hide();
  }

  private search(pageIndex = 1) {
    let param = new TypeaheadRequestParams(this.el.value);
    param.setPage(pageIndex, this.pageSize);
    if (this.source) {
      this.source(param)
        .then(result => result || new PagedResult())
        .then(result => {
          if (result.totalCount <= 0) {
            this.notFound.emit();
          } else {
            this.componentRef.instance.result = result;
            this.show();
          }
        })
        .catch(err => {
          this.notFound.emit();
        });
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
    let wrapper = document.createElement("div");
    wrapper.className = 'input-group';
    this.el.parentElement.insertBefore(wrapper, this.el.nextSibling);
    wrapper.appendChild(this.el);
    let span = document.createElement('span');
    span.className = "input-group-addon";
    span.style.borderTopRightRadius = "0.25rem";
    span.style.borderBottomRightRadius = "0.25rem";
    span.style.borderRightWidth = "1px";
    span.style.borderRightStyle = "solid";
    span.style.borderRightColor = "rgba(0, 0, 0, 0.14902)";
    span.innerHTML = '<i class="fa fa-search"></i>';
    wrapper.appendChild(span);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableTypeaheadComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    let ne = this.componentRef.location.nativeElement;
    ne.style.transition = 'height 0.3s ease-in';
    wrapper.appendChild(ne);
    let component = this.componentRef.instance;
    component.columns = this.columns;
    component.onRemove = this.onRemove;
    component.size = this.pageSize;
    component.multiple = this.multiple;
    component.onPageChange.subscribe(params => {
      this.paging = true;
      this.search(params.pageIndex);
    });
    component.onSelect.subscribe((item) => {
      let originValue = this.el.value;
      if (!this.multiple) {
        let selectedValue = this.sortedKeys
          .filter(key => item[key])
          .map(key => item[key].toString())
          .find(value => value.includes(originValue));
        if (selectedValue) {
          this.el.value = selectedValue.trim();
        }
      }
      this.onSelect.emit(item);
    })
    Observable.fromEvent(this.el, 'input')
      .map((e: any) => e.target.value)
      .debounceTime(this.delay)
      .subscribe(value => {
        this.hide();
        this.search();
      });
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
