import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, EventEmitter, Output, OnInit, HostListener, Component, ComponentRef, Injector, TemplateRef, Optional } from '@angular/core';
import { TableTypeaheadComponent } from './table-typeahead.component';
import { PagedResult, PagedParams } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { FormControlName, NgModel, FormControl } from '@angular/forms';
@Directive({
  selector: '[hqTableTypeahead]',
  exportAs: 'hq-table-typeahead'
})
export class TableTypeaheadDirective implements OnInit {
  @Input("hqTableTypeahead")
  protected source: (params: TypeaheadRequestParams) => Promise<PagedResult<any>>;
  @Input()
  protected delay: number = 600;
  @Input()
  protected forceRefresh: boolean;
  @Input()
  protected columns: Array<TableTypeaheadColumn>;
  @Input()
  protected pageSize: number = 10;
  @Input()
  protected multiple: boolean;
  @Input()
  protected showTitle = true;
  @Input()
  protected checkStrategy: (item: any) => boolean;
  @Input()
  protected params: Object;
  @Output()
  protected onEmpty = new EventEmitter<string>();
  @Output()
  protected onSelect = new EventEmitter<any>();
  @Input()
  protected filed: string;

  private el: HTMLInputElement;
  private componentRef: ComponentRef<TableTypeaheadComponent>;
  private paging = false;
  private statusElement: HTMLElement;
  private control: FormControl;

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    @Optional()
    protected formControlName?: FormControlName,
    @Optional()
    protected ngModel?: NgModel,
  ) {
    this.el = this.viewContainerRef.element.nativeElement;
  }
  @HostListener('blur', ['$event'])
  onBlur(event) {
    if (!this.multiple) {
      setTimeout(() => {
        if (this.paging) {
          this.el.focus();
          this.paging = false;
        } else {
          this.hide();
        }
      }, 200);
    }
  }
  @HostListener('focus', ['$event'])
  onFocus(event) {
    if (!this.paging && event.sourceCapabilities) {
      this.search();
    }
  }
  @HostListener('input', ['$event'])
  onInput(event) {
    this.componentRef.instance.result = null;
  }
  show() {
    let rect = this.el.getBoundingClientRect();
    this.componentRef.instance.minWidth = rect.width;
    this.componentRef.instance.height = rect.height;
    this.componentRef.instance.show();
  }
  hide() {
    this.componentRef.instance.hide();
  }
  private search(pageIndex = 1) {
    if (!this.paging) {
      this.componentRef.instance.result = null;
    }
    let param = new TypeaheadRequestParams(this.el.value);
    param.setPage(pageIndex, this.pageSize);
    if (this.source) {
      this.statusElement.classList.add('fa-spinner', 'fa-spin');
      this.source(param)
        .then(result => result || new PagedResult())
        .then(result => {
          if (!result.data.length) {
            this.onEmpty.emit(param.text);
          }
          if (this.multiple && this.checkStrategy) {
            result.data.forEach(m => {
              m.checked = this.checkStrategy(m);
            });
          }
          this.componentRef.instance.result = result;
          this.show();
        })
        .then(() => this.statusElement.classList.remove('fa-spinner', 'fa-spin'))
        .catch(err => {
          console.log(err);
          this.statusElement.classList.remove('fa-spinner', 'fa-spin');
          this.componentRef.instance.result = null;
        });
    }
  }
  ngOnInit(): void {
    this.control = this.formControlName && this.formControlName.control;
    this.control = this.control || this.ngModel && this.ngModel.control;
    this.el.style.borderBottomLeftRadius = "0.25rem";
    this.el.style.borderTopLeftRadius = "0.25rem";
    let wrapper = document.createElement("div");
    this.el.insertAdjacentElement('beforebegin', wrapper);
    wrapper.className = 'input-group';
    wrapper.appendChild(this.el);
    let span = document.createElement('span');
    span.className = "input-group-addon";
    this.statusElement = document.createElement('i');
    this.statusElement.className = "cursor-pointer fa fa-search";
    span.appendChild(this.statusElement);
    wrapper.appendChild(span);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableTypeaheadComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    let ne = this.componentRef.location.nativeElement;
    wrapper.insertAdjacentElement('afterbegin', ne);
    if (this.showTitle) {
      if (!this.columns || this.columns.length < 2) {
        this.showTitle = false;
      }
    }
    let component = this.componentRef.instance;
    component.columns = this.columns;
    component.size = this.pageSize;
    component.multiple = this.multiple;
    component.showTitle = this.showTitle;
    component.onPageChange.subscribe(params => {
      this.paging = true;
      this.search(params.pageIndex);
    });
    component.onSelect.subscribe((item) => {
      let selectedValue = item[this.filed];
      if (!this.multiple && selectedValue) {
        if (this.control) {
          this.control.setValue(selectedValue.trim());
        } else {
          this.el.value = selectedValue.trim();
        }
        setTimeout(() => {
          this.paging = false;
        }, this.delay + 100);
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
    this.statusElement.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      if (this.el.readOnly) return false;
      let el = event.target as HTMLElement;
      if (!el.classList.contains('fa-spinner')) {
        this.search();
      }
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
