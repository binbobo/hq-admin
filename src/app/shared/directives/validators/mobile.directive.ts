import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqMobile]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MobileValidator, multi: true }]
})
export class MobileValidator implements Validator {

  static validator = (c: AbstractControl) => {
    const valid = /^1\d{10}$/.test(c.value);
    return !valid ? { 'mobile': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return MobileValidator.validator;
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
