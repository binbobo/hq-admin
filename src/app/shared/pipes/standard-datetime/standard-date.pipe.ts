import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateFormatPipe } from './date-format';

@Pipe({
  name: 'sDate'
})
export class StandardDatePipe extends DateFormatPipe implements PipeTransform {

  constructor() {
    super('YYYY-MM-DD');
  }

}
