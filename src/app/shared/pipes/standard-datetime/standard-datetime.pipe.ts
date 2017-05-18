import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatPipe } from './date-format';

@Pipe({
  name: 'sDatetime'
})
export class StandardDatetimePipe extends DateFormatPipe implements PipeTransform {

  constructor() {
    super('YYYY/MM/DD HH:mm:ss');
  }

}
