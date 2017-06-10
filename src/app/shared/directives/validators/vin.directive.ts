import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqVin]',
  providers: [{ provide: NG_VALIDATORS, useExisting: VINValidator, multi: true }]
})
export class VINValidator implements Validator {

  static validator = (c: AbstractControl) => {
    // const valid = /^[A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{3}\d{5}$/.test(c.value);
    const valid = /^[A-Za-z\d]{17}$/.test(String(c.value));
    return c.value && !valid ? { 'vin': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return VINValidator.validator(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
