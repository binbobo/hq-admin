import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, EventEmitter, Output, OnInit, HostListener, Component, ComponentRef, Injector, TemplateRef, Optional, ElementRef } from '@angular/core';
import { TableTypeaheadComponent } from './table-typeahead.component';
import { PagedResult, PagedParams } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { FormControlName, NgModel, FormControl } from '@angular/forms';
import { inject } from '@angular/core/testing';
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
  protected selectedField: string;

  private el: HTMLInputElement;
  private componentRef: ComponentRef<TableTypeaheadComponent>;
  private paging = false;
  private statusElement: HTMLElement;
  private control: FormControl;

  protected viewContainerRef: ViewContainerRef;
  protected componentFactoryResolver: ComponentFactoryResolver

  constructor(
    private injector: Injector,
  ) {
    this.viewContainerRef = this.injector.get(ViewContainerRef);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
    this.el = this.viewContainerRef.element.nativeElement;
  }

  ngOnInit(): void {
    if (!this.selectedField) {
      let col = this.columns && this.columns.find(m => m.selected);
      col = col || this.columns && this.columns.length && this.columns[0];
      col && (this.selectedField = col.name);
    }
    this.setControl();
    this.generateHtml();
    this.initComponent();
    this.bindEvent();
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

  private setControl() {
    this.control = this.injector.get(FormControl, null);
    if (this.control) return;
    let controlName = this.injector.get(FormControlName, null);
    controlName && (this.control = controlName.control);
    if (this.control) return;
    let ngModel = this.injector.get(NgModel, null);
    ngModel && (this.control = ngModel.control);
  }

  private generateHtml() {
    this.el.style.borderBottomLeftRadius = "0.25rem";
    this.el.style.borderTopLeftRadius = "0.25rem";
    let wrapper = document.createElement("div");
    this.el.insertAdjacentElement('beforebegin', wrapper);
    wrapper.className = 'input-group';
    wrapper.appendChild(this.el);
    let span = document.createElement('span');
    span.className = "input-group-addon";
    span.style.backgroundColor = "#fff";
    this.statusElement = document.createElement('i');
    this.statusElement.className = "cursor-pointer fa fa-search";
    span.appendChild(this.statusElement);
    wrapper.appendChild(span);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableTypeaheadComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    let ne = this.componentRef.location.nativeElement;
    wrapper.insertAdjacentElement('afterbegin', ne);
  }

  private initComponent() {
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
      let selectedValue = item[this.selectedField];
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
  }

  private bindEvent() {
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
    public title?: string,
    public maxLength?: number,
    public selected?: boolean,
  ) { }
}
export class TypeaheadRequestParams extends PagedParams {
  constructor(public text?: string) {
    super();
  }
}
