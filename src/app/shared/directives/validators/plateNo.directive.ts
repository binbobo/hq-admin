import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqPlateNo]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PlateNoValidator, multi: true }]
})
export class PlateNoValidator implements Validator {

  static validator = (c: AbstractControl) => {
    const valid = /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z_0-9]{5}$/.test(c.value);
    return c.value && !valid ? { 'plateNo': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return PlateNoValidator.validator;
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
