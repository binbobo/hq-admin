import { Pipe, PipeTransform, Sanitizer, SecurityContext } from '@angular/core';

@Pipe({
  name: 'html'
})
export class HtmlPipe implements PipeTransform {

  constructor(private sanitizer: Sanitizer) { }

  transform(value: any, args?: any): any {
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }

}
