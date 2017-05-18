import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'centToYuan'
})
export class CentToYuanPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let cent = parseFloat(value);
    if (isNaN(cent)) return '0.00';
    return ((cent || 0) / 100).toFixed(2);
  }
}






