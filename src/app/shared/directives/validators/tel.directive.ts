import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqTel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: TelValidator, multi: true }]
})
export class TelValidator {

  static validator = (c: AbstractControl) => {
    const valid = /^(\d+-)*\d+$/.test(c.value);
    return c.value && !valid ? { 'tel': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return TelValidator.validator;
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
