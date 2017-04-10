import { Component, OnInit } from '@angular/core';
import { UserService, HttpService, Urls, DefaultRequestOptions, EventDispatcher } from 'app/shared/services';
import { ListResult } from 'app/shared/models';
import { LanguageService } from './locale/language/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  private menus: Array<any>;
  private languages: Array<any>;
  private language: any;
  private readonly languageKey: string = 'GLOBAL_LANGUAGE';

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private languageService: LanguageService,
    private translate: TranslateService,
    private dispatcher: EventDispatcher,
  ) { }

  ngOnInit() {
    let lang = localStorage.getItem(this.languageKey);
    if (lang) {
      try {
        this.language = JSON.parse(lang);
        this.dispatcher.emit('LanguageChanged', this.language.culture);
        this.translate.use(this.language.culture);
      }
      finally { }
    }
    this.loadMenus();
    this.loadLanguages();
  }

  loadMenus() {
    this.httpService.get<ListResult<Menu>>(Urls.user.concat('/menus/tree'))
      .then(m => {
        this.menus = null;
        setTimeout(() => this.menus = m.data, 0);
      })
      .catch(err => console.error(err));
  }

  loadLanguages() {
    this.languageService.getAvailableList(true)
      .then(data => this.languages = data)
      .catch(err => console.error(err));
  }

  onSelectLanguage(item: any) {
    if (this.language && item.culture === this.language.culture) return;
    this.languages.forEach(m => m.selected = m === item);
    this.language = item;
    this.dispatcher.emit('LanguageChanged', item.culture);
    this.translate.use(item.culture);
    localStorage.setItem(this.languageKey, JSON.stringify(item));
    this.loadMenus();
  }
}

class Menu {
  constructor(
    public title: string,
    public path?: string,
    public icon?: string,
    public children?: Array<Menu>
  ) { }
}
