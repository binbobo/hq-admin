import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondToTime'
})
export class SecondToTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let val = parseFloat(value);
    if (isNaN(val)) { return '0'; }
    if (val = 60) { return '1分'; }
    if (val = 3600) { return '1时'; }
    if (val = 86400) { return '1天'; }
    if (val < 60) {
      return Math.floor(val) + '秒';
    }
    if (val > 60 && val < 3600) {
      let min1 = Math.floor(val / 60);
      let second1 = Math.floor(val - (min1 * 60));
      return min1 + '分' + second1 + '秒';
    }
    if (val > 3600 && val < 86400) {
      let hour2 = Math.floor(val / 3600);
      let min2 = Math.floor((val - (hour2 * 3600)) / 60);
      let second2 = Math.floor(val - (hour2 * 3600) - (min2 * 60));
      return hour2 + "时" + min2 + "分" + second2 + "秒";
    }
    if (val > 86400) {
      let day3 = Math.floor(val / 86400);
      let hour3 = Math.floor((val - (day3 * 86400)) / 3600);
      let min3 = Math.floor((val - (day3 * 86400) - (hour3 * 3600)) / 60);
      let second3 = Math.floor(val - (day3 * 86400) - (hour3 * 3600) - (min3 * 60));
      return day3 + "天" + hour3 + "时" + min3 + "分" + second3 + "秒";
    }
  }
}
