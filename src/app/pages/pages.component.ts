import { Component, OnInit } from '@angular/core';
import { UserService, HttpService, Urls, DefaultRequestOptions, EventDispatcher } from 'app/shared/services';
import { ListResult } from 'app/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from './pages.service';
import { StorageKeys } from '../shared/models/storage-keys';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  private menus: Array<any>;
  private languages: Array<any>;
  private language: any;

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private service: PagesService,
    private translate: TranslateService,
    private dispatcher: EventDispatcher,
  ) { }

  ngOnInit() {
    this.loadMenus();
    this.loadLanguages();
  }

  loadMenus() {
    this.service.getMenuTree()
      .then(data => {
        this.menus = null;
        setTimeout(() => this.menus = data, 0);
      })
      .catch(err => console.error(err));
  }

  loadLanguages() {
    this.service.getLanguages()
      .then(data => this.languages = data)
      .then(data => this.language = data.find(m => m.culture === this.translate.currentLang))
      .catch(err => console.error(err));
  }

  onSelectLanguage(item: any) {
    if (this.language && item.culture === this.language.culture) return;
    this.languages.forEach(m => m.checked = m === item);
    this.language = item;
    this.dispatcher.emit('LanguageChanged', item);
    this.translate.use(item.culture);
    localStorage.setItem(StorageKeys.AcceptLanguage, JSON.stringify(item));
    this.loadMenus();
  }
}
