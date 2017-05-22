import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'durationHumanize'
})
export class DurationHumanizePipe implements PipeTransform {

  static units = ['quarters', 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];
  static shorthandUnits = ['Q', 'y', 'M', 'w', 'd', 'h', 'm', 's', 'ms'];

  transform(value: any, unit?: any, format?: string): any {
    if (!value) return value;
    unit = unit || 'seconds';
    format = format || '{h}时{m}分{s}秒';
    let duration = moment.duration(value, unit);
    let first = true;
    if (!moment.isDuration(duration)) return value;
    DurationHumanizePipe.shorthandUnits
      .filter(m => format.includes(`{${m}}`))
      .forEach(m => {
        let index = DurationHumanizePipe.shorthandUnits.indexOf(m);
        let unit: any = DurationHumanizePipe.units[index];
        let val = first ? Math.floor(duration.as(unit)) : duration.get(unit);
        console.log(val, index, unit, duration.as(unit));
        format = format.replace(`{${m}}`, val.toString());
        first = false;
        // if (val > 0) {
        //   format = format.replace(`{${m}}`, val.toString());
        // } else {
        //   let start = format.indexOf(`{${m}}`);
        //   let end = format.indexOf('{', start + 1);
        //   end = ~end ? end : format.length;
        //   let content = format.substring(start, end);
        //   format = format.replace(content, '');
        // }
      })
    return format;
  }

}
