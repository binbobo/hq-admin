import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'centToYuan'
})
export class CentToYuanPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let cent = parseFloat(value);
    return (cent || 0).toFixed(2);
  }
}
