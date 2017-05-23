import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqEngineNo]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EngineNoValidator, multi: true }]
})
export class EngineNoValidator implements Validator {

  static validator = (c: AbstractControl) => {
    const valid = /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/.test(c.value);
    return c.value && !valid ? { 'engineNo': true } : null;
  }

  validate(c: AbstractControl): ValidationErrors {
    return EngineNoValidator.validator;
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
