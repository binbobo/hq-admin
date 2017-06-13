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
    NguiDatetime.months = [
      { fullName: '一月', shortName: '1月' },
      { fullName: '二月', shortName: '2月' },
      { fullName: '三月', shortName: '3月' },
      { fullName: '四月', shortName: '4月' },
      { fullName: '五月', shortName: '5月' },
      { fullName: '六月', shortName: '6月' },
      { fullName: '七月', shortName: '7月' },
      { fullName: '八月', shortName: '8月' },
      { fullName: '九月', shortName: '9月' },
      { fullName: '十月', shortName: '10月' },
      { fullName: '十一月', shortName: '11月' },
      { fullName: '十二月', shortName: '12月' },
    ];
    NguiDatetime.daysOfWeek = [
      { fullName: '周日', shortName: '日' },
      { fullName: '周一', shortName: '一' },
      { fullName: '周二', shortName: '二' },
      { fullName: '周三', shortName: '三' },
      { fullName: '周四', shortName: '四' },
      { fullName: '周五', shortName: '五' },
      { fullName: '周六', shortName: '六' },
    ]
    NguiDatetime.locale.currentTime = '当前时间';
    NguiDatetime.locale.time = '时间';
    NguiDatetime.locale.hour = '小时';
    NguiDatetime.locale.minute = '分钟';
    NguiDatetime.locale.year = '年';
    NguiDatetime.locale.date = '日期';
    NguiDatetime.locale.day = '天';
    NguiDatetime.locale.month = '月';
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
