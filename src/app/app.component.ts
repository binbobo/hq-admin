import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(translate:TranslateService){
    translate.setDefaultLang(window.navigator.language);
    translate.use(window.navigator.language);
  }
}
