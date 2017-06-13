import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqMobile]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MobileValidator, multi: true }]
})
export class MobileValidator implements Validator {

  static validator = (c: AbstractControl) => {
    const valid = /^[1][3,5,7,8]\d{9}$/.test(c.value);
    return c.value && !valid ? { 'mobile': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return MobileValidator.validator(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
