import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { EventDispatcher } from 'app/shared/services';
import { StorageKeys } from "app/shared/models";

declare var moment: any;
moment.locale('zh-cn');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  myDate=null;
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
