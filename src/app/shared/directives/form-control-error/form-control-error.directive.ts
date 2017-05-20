import { Directive, Input, OnInit, Host, OnDestroy, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener, ComponentRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FormControlErrorComponent } from './form-control-error/form-control-error.component';

@Directive({
  selector: '[hqError]',
  exportAs: 'hq-error'
})
export class FormControlErrorDirective implements OnInit, OnDestroy {

  @Input('hqError')
  private name: string;
  @Input()
  private placeholder: string;
  @Input()
  private errors: any;
  @Input()
  private readonly: boolean;
  private valueChange: Subscription;
  private componentRef: ComponentRef<FormControlErrorComponent>;

  @HostListener('blur', ['$event'])
  private onblur(event: Event) {
    if (this.readonly === undefined) {
      this.validate();
    }
  }

  constructor(
    private el: ElementRef,
    private formControl: FormControlName,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    if (this.errors) {
      Object.keys(this.errors).forEach(key => this.errors[key.toLowerCase()] = this.errors[key]);
    }
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(FormControlErrorComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    let input = this.el.nativeElement as HTMLInputElement;
    if (!this.placeholder && this.name && (this.el.nativeElement instanceof HTMLInputElement)) {
      input.placeholder = `请输入${this.name}`;
    }
    if (input.parentElement.classList.contains('input-group')) {
      input.parentElement.insertAdjacentElement('afterend', this.componentRef.location.nativeElement);
    }
    this.name = this.name || this.formControl.name;
    let control = this.formControl;
    this.valueChange = control.valueChanges.subscribe(data => {
      this.componentRef.instance.errors = [];
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
      this.componentRef.instance.errors = keys.map(m => this.getError(m.toLowerCase(), control.errors));
    }
    return control.valid;
  }

  private getError(key: string, errors: Object): string {
    if (this.errors && key in this.errors) {
      return this.errors[key].replace(/{name}/g, this.name);
    }
    let error = errors[key];
    if (key === 'maxlength') {
      return `${this.name}长度不能超过${error.requiredLength}位，当前长度${error.actualLength}`;
    } else if (key === 'required') {
      return `${this.name}不能为空`;
    } else if (key === 'minlength') {
      return `${this.name}长度不能少于${error.requiredLength}位，当前长度${error.actualLength}`;
    } else if (key === 'equalto') {
      return `${this.name}输入不一致`;
    } else if (key === 'pattern') {
      return `无效的${this.name}`;
    } else if (key === 'digits') {
      return `${this.name}必须是整数`;
    } else if (key === "gte") {
      return `${this.name}不能低于最小限制范围`;
    } else if (key === "lte") {
      return `${this.name}不能高于最高限制范围`;
    } else if (key === "range") {
      return `${this.name}不能超出限定范围限制范围`;
    }
    else {
      console.log(key, errors);
      return `无效的${this.name}`;
    }
  }
}
