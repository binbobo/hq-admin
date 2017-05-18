import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatPipe } from './date-format';

@Pipe({
  name: 'sTime'
})
export class StandardTimePipe extends DateFormatPipe implements PipeTransform {

  constructor() {
    super('HH:mm:ss');
  }
}
