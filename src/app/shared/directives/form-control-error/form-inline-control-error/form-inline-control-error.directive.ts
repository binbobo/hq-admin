import { Directive, Input, ComponentRef, HostListener, ElementRef, ViewContainerRef, ComponentFactoryResolver, Renderer } from '@angular/core';
import { FormInlineControlErrorComponent } from './form-inline-control-error.component';
import { Subscription } from 'rxjs/Subscription';
import { NgModel } from "@angular/forms";
import { FormControlErrorDirective } from '../form-control-error.directive';
import { ComponentLoader, ComponentLoaderFactory, PopoverConfig, PositioningService } from 'ngx-bootstrap';

@Directive({
  selector: '[ngModel]',
  exportAs: 'hq-inline-error'
})
export class FormInlineControlErrorDirective extends FormControlErrorDirective<FormInlineControlErrorComponent> {

  private _popover: ComponentLoader<FormInlineControlErrorComponent>;

  constructor(
    protected el: ElementRef,
    protected ngModel: NgModel,
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    private config: PopoverConfig,
    renderer: Renderer,
    cis: ComponentLoaderFactory,
    private positionService: PositioningService,
  ) {
    super(el, viewContainerRef, componentFactoryResolver, ngModel.control);
    this._popover = cis
      .createLoader<FormInlineControlErrorComponent>(el, viewContainerRef, renderer)
      .provide({ provide: PopoverConfig, useValue: config });
  }

  public show(): void {
    if (this._popover.isShown) {
      return;
    }
    let aa = this._popover
      .attach(FormInlineControlErrorComponent)
      .position({ attachment: this.config.placement })
      .show();
    aa.instance.errors = this.controlErrors;
  }

  public hide(): void {
    this._popover.hide();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public ngOnDestroy(): any {
    this._popover.dispose();
  }
}
