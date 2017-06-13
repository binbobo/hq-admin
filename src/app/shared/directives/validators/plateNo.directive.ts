import { Directive } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
  selector: '[hqPlateNo]',
  providers: [{ provide: NG_VALIDATORS, useExisting: PlateNoValidator, multi: true }]
})
export class PlateNoValidator implements Validator {

  static validator = (c: AbstractControl) => {
    const valid = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(String(c.value).toUpperCase());
    // 高于7位不再验证
    return c.value && (c.value.trim().length < 8) && !valid ? { 'plateNo': true } : null;
  }
 
  validate(c: AbstractControl): ValidationErrors {
    return PlateNoValidator.validator(c);
  }

  registerOnValidatorChange(fn: () => void): void {
    //throw new Error("Method not implemented.");
  }

  constructor() { }

}
