import { Directive, Input, OnInit, Host, OnDestroy, ViewContainerRef, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FormControlErrorComponent } from './form-control-error/form-control-error.component';

@Directive({
  selector: '[hqError]'
})
export class FormControlErrorDirective implements OnInit, OnDestroy {

  @Input('hqError')
  private name: string;
  @Input()
  private placeholder: string;
  private valueChange: Subscription;
  private component: FormControlErrorComponent;

  constructor(
    private el: ElementRef,
    private formControl: FormControlName,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(FormControlErrorComponent);
    let componentRef = viewContainerRef.createComponent(componentFactory);
    this.component = (<FormControlErrorComponent>componentRef.instance);
  }

  ngOnInit() {
    let input = this.el.nativeElement as HTMLInputElement;
    if (!this.placeholder && this.name && (this.el.nativeElement instanceof HTMLInputElement)) {
      input.placeholder = `请输入${this.name}`;
    }
    this.name = this.name || this.formControl.name;
    let control = this.formControl;
    this.valueChange = control.valueChanges.subscribe(data => {
      this.component.errors = [];
      this.validate(false);
    });
  }

  ngOnDestroy(): void {
    if (this.valueChange) {
      this.valueChange.unsubscribe();
    }
  }

  public validate(compulsive = true): boolean {
    let control = this.formControl;
    if (control.invalid && (compulsive || control.dirty || control.touched)) {
      let keys = Object.keys(control.errors);
      this.component.errors = keys.map(m => this.getError(m, control.errors));
    }
    return control.valid;
  }

  private getError(key: string, errors: Object): string {
    let error = errors[key];
    if (key === 'maxlength') {
      return `${this.name}长度不能超过${error.requiredLength}位，当前长度${error.actualLength}`;
    } else if (key === 'required') {
      return `${this.name}不能为空`;
    } else if (key === 'minlength') {
      return `${this.name}长度不能少于${error.requiredLength}位，当前长度${error.actualLength}`;
    } else if (key === 'equalTo') {
      return `${this.name}输入不一致`;
    } else if (key === 'pattern') {
      return `无效的${this.name}`;
    }
  }
}
