import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    args = args || ',';
    return value.split(args)
  }

}
