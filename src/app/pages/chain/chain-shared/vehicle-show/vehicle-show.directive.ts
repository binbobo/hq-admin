import { Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ComponentRef } from '@angular/core';
import { VehicleShowComponent } from './vehicle-show.component';

@Directive({
  selector: '[hqVehicleShow]'
})
export class VehicleShowDirective implements OnInit, OnChanges {

  private componentRef: ComponentRef<VehicleShowComponent>;

  ngOnChanges(changes: SimpleChanges): void {
    if ('vehicles' in changes && this.componentRef) {
      this.componentRef.instance.vehicles = changes['vehicles'].currentValue;
    }
  }

  ngOnInit(): void {
    let factory = this.componentFactoryResolver.resolveComponentFactory<VehicleShowComponent>(VehicleShowComponent);
    let compnent = this.viewContainerRef.createComponent(factory);
    compnent.instance.vehicles = this.vehicles;
    let el = this.el.nativeElement as HTMLElement;
    el.appendChild(compnent.location.nativeElement);
  }

  @Input('hqVehicleShow')
  private vehicles: Array<any>;
  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

}
