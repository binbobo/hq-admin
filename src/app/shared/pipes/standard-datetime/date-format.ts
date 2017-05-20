import { PipeTransform } from '@angular/core';
import * as moment from 'moment';
export class DateFormatPipe implements PipeTransform {

    constructor(private format: string) { }

    transform(value: any, args?: any): any {
        if (!value) return value;
        let m = moment(value);
        if (!m.isValid()) return value;
        return m.format(this.format);
    }

}
