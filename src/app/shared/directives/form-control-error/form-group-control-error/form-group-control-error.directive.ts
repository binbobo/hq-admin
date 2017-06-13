import { Directive, Input, OnInit, Host, OnDestroy, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener, ComponentRef, Type } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FormGroupControlErrorComponent } from './form-group-control-error.component';
import { FormControlErrorDirective } from '../form-control-error.directive';

@Directive({
  selector: '[formControl],[formControlName]',
  exportAs: 'hq-error'
})
export class FormGroupControlErrorDirective extends FormControlErrorDirective<FormGroupControlErrorComponent> {

  constructor(
    protected el: ElementRef,
    protected formControl: FormControlName,
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(el, viewContainerRef, componentFactoryResolver, formControl.control);
  }

  ngOnInit() {
    this.control = this.formControl.control;
    super.ngOnInit();
    this.createComponent(FormGroupControlErrorComponent);
    this.componentRef.instance.errors = this.controlErrors;
  }

}
