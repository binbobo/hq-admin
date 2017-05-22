import { Directive, Input, OnInit, Host, ViewContainerRef, ComponentFactoryResolver, ElementRef, HostListener, ComponentRef, Type } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { FormControlErrorComponent } from './form-control-error.component';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

export class FormControlErrorDirective<T extends FormControlErrorComponent> implements OnInit {

  @Input()
  protected label: string = "";
  @Input()
  protected errors: any;
  @Input()
  protected readonly: boolean;
  protected controlErrors: Array<string>;
  protected componentRef: ComponentRef<T>;

  @HostListener('blur', ['$event'])
  private onblur(event: Event) {
    if (this.readonly === undefined) {
      setTimeout(() => {
        this.validate();
      }, 100);
    }
  }

  @HostListener('focus', ['$event'])
  private onfocus(event: Event) {
    this.hide();
  }

  constructor(
    protected el: ElementRef,
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected control: FormControl,
  ) { }

  ngOnInit() {
    if (this.errors) {
      Object.keys(this.errors).forEach(key => this.errors[key.toLowerCase()] = this.errors[key]);
    }
    // if (!this.readonly) {
    //   Observable.fromEvent(this.el.nativeElement, 'input')
    //     .map((e: any) => e.target.value)
    //     .debounceTime(100)
    //     .subscribe(value => {
    //       this.controlErrors = [];
    //       this.validate(false);
    //     });
    // }
  }

  protected show(): void {
    if (this.componentRef) {
      this.componentRef.instance.errors = this.controlErrors;
    }
  }

  protected hide(): void {
    this.controlErrors = null;
    if (this.componentRef) {
      this.componentRef.instance.errors = this.controlErrors;
    }
  }

  protected createComponent(type: Type<T>, position: string = "afterend") {
    let input = this.el.nativeElement as HTMLInputElement;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(type);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    if (input.parentElement.classList.contains('input-group')) {
      input.parentElement.insertAdjacentElement(position, this.componentRef.location.nativeElement);
    } else {
      input.insertAdjacentElement(position, this.componentRef.location.nativeElement);
    }
    this.componentRef.instance.errors = this.controlErrors;
  }

  public validate(compulsive = true): boolean {
    let control = this.control;
    if (control.invalid && (compulsive || control.dirty || control.touched)) {
      let keys = Object.keys(control.errors);
      this.controlErrors = keys
        .filter(m => control.errors[m] === true || typeof control.errors[m] === 'object')
        .map(m => this.getError(m.toLowerCase(), control.errors));
      this.show();
    } else {
      this.hide();
    }
    return control.valid;
  }

  private getError(key: string, errors: any): string {
    if (this.errors && key in this.errors) {
      return this.errors[key].replace(/{name}/g, this.label);
    }
    let error = errors[key];
    if (key === 'maxlength') {
      return `${this.label}长度不能超过${error.requiredLength}位，当前长度${error.actualLength}`;
    } else if (key === 'required') {
      return `${this.label}不能为空`;
    } else if (key === 'minlength') {
      return `${this.label}长度不能少于${error.requiredLength}位，当前长度${error.actualLength}`;
    } else if (key === 'equalto') {
      return `${this.label}输入不一致`;
    } else if (key === 'pattern') {
      return `无效的${this.label}`;
    } else if (key === 'digits') {
      return `${this.label}必须是有效的自然数`;
    } else if (key === "gte") {
      return `${this.label}不能低于最小限制范围`;
    } else if (key === "lte") {
      return `${this.label}不能高于最高限制范围`;
    } else if (key === "range") {
      return `${this.label}不能超出限定范围限制范围`;
    } else if (key === "max") {
      return `${this.label}超出最大值${errors.requiredValue}限制`;
    } else if (key === "min") {
      return `${this.label}超出最小值${errors.requiredValue}限制`;
    } else {
      console.log(key, error, errors);
      return `无效的${this.label}`;
    }
  }
}
