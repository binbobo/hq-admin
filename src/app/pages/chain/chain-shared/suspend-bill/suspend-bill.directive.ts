import { Directive, Input, ElementRef, ViewContainerRef, ComponentFactoryResolver, OnInit, Output, EventEmitter } from '@angular/core';
import { SuspendBillComponent } from './suspend-bill.component';
import { SuspendedBillItem } from './suspend-bill.service';
import { SuspendBillService } from './suspend-bill.service';

@Directive({
  selector: '[hqSuspendBill]',
  exportAs: 'hq-suspend-bill'
})
export class SuspendBillDirective implements OnInit {

  @Input("hqSuspendBill")
  protected type: string;
  @Input()
  protected columns: Array<SuspendBillColumn>;
  @Output()
  protected onSelect = new EventEmitter<SuspendedBillItem>();
  @Output()
  protected onRemove: EventEmitter<SuspendedBillItem> = new EventEmitter<SuspendedBillItem>();
  public suspending: boolean;
  protected selectedItem: SuspendedBillItem;
  private component: SuspendBillComponent;
  constructor(
    protected service: SuspendBillService,
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit(): void {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SuspendBillComponent);
    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.component = (<SuspendBillComponent>componentRef.instance);
    this.component.columns = this.columns;
    this.component.type = this.type;
    this.component.onSelect = this.onSelect;
    this.component.onSelect.subscribe(m => {
      this.selectedItem = m;
    });
    this.component.onRemove.subscribe(m => {
      if (this.selectedItem && this.selectedItem.id === m.id) {
        this.selectedItem = null;
      }
      this.onRemove.emit(m);
    })
  }

  public suspend(data: any): Promise<void> {
    this.suspending = true;
    if (this.selectedItem) {
      return this.service.update(data, this.type, this.selectedItem.id)
        .then(() => { this.suspending = false })
        .catch(err => {
          this.suspending = true;
          return Promise.reject(err);
        });
    } else {
      return this.service.create(data, this.type)
        .then(() => { this.suspending = false })
        .catch(err => {
          this.suspending = true;
          return Promise.reject(err);
        });
    }
  }

  public refresh() {
    this.component.loadList();
  }

}

export class SuspendBillColumn {
  public name: string;
  public title: string;
}