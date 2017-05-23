import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqMileage]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MileageValidator, multi: true }]
})
export class MileageValidator implements Validator {

  static validator = (c: AbstractControl) => {
    const valid = /^[0-9]+([.]{1}[0-9]{1,2})?$/.test(c.value);
    return !valid ? { 'mileage': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return MileageValidator.validator;
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
