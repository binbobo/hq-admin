import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { EventDispatcher } from 'app/shared/services';
import { StorageKeys } from "app/shared/models";
import { NguiDatetime } from '@ngui/datetime-picker';

declare var moment: any;
moment.locale('zh-cn');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private dispatcher: EventDispatcher,
  ) {

  }

  ngOnInit() {
    NguiDatetime.locale.currentTime = '当前时间';
    NguiDatetime.locale.time = '时间';
    NguiDatetime.locale.hour = '小时';
    NguiDatetime.locale.minute = '分钟';
    NguiDatetime.locale.year = '年';
    this.translate.setDefaultLang(window.navigator.language);
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
