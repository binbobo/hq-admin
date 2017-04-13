import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { EventDispatcher } from 'app/shared/services';
import { StorageKeys } from "app/shared/models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private dispatcher: EventDispatcher,
  ) {
    translate.setDefaultLang(window.navigator.language);
  }

  ngOnInit() {
    let langJSON = localStorage.getItem(StorageKeys.AcceptLanguage);
    if (langJSON) {
      try {
        let lang = JSON.parse(langJSON);
        this.dispatcher.emit('LanguageChanged', lang);
        this.translate.use(lang.culture);
      }
      catch (e) {
        this.translate.use(window.navigator.language);
      }
      finally { }
    } else {
      this.translate.use(window.navigator.language);
    }
  }
}
