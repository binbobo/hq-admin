import { Directive, Input, ElementRef, ViewContainerRef, ComponentFactoryResolver, OnInit, Output, EventEmitter } from '@angular/core';
import { SuspendBillComponent } from './suspend-bill.component';
import { SuspendedBillItem } from './suspend-bill.service';
import { SuspendBillsService } from './suspend-bill.service';

@Directive({
  selector: '[hqSuspendBill]',
  exportAs: 'hq-suspend-bill'
})
export class SuspendBillDirective implements OnInit {

  @Input("hqSuspendBill")
  private type: string;
  @Input()
  private columns: Array<SuspendBillColumn>;
  @Output()
  private onSelect = new EventEmitter<SuspendedBillItem>();
  @Output()
  private onRemove: EventEmitter<SuspendedBillItem> = new EventEmitter<SuspendedBillItem>();

  private selectedItem: SuspendedBillItem;
  private component: SuspendBillComponent;
  constructor(
    private service: SuspendBillsService,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
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
    if (this.selectedItem) {
      return this.service.update(data, this.type, this.selectedItem.id);
    } else {
      return this.service.create(data, this.type);
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