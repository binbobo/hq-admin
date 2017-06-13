import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqIDCard]',
  providers: [{ provide: NG_VALIDATORS, useExisting: IDCardValidator, multi: true }]
})
export class IDCardValidator implements Validator {

  static validator = (c: AbstractControl) => {
    const valid = /\d{15}(\d\d[0-9xX])?/.test(c.value);
    return c.value && !valid ? { 'idCard': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return IDCardValidator.validator(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
