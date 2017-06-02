import { Component, OnInit } from '@angular/core';
import { UserService, HttpService, Urls, EventDispatcher } from 'app/shared/services';
import { ListResult } from 'app/shared/models';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from './pages.service';
import { StorageKeys } from '../shared/models/storage-keys';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { OrganizationService } from './organization.service';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  private menus: Array<any>;
  private languages: Array<any>;
  private language: any;
  private loading: boolean = true;

  constructor(
    private userService: UserService,
    private httpService: HttpService,
    private service: PagesService,
    private translate: TranslateService,
    private dispatcher: EventDispatcher,
    private employeeService: EmployeeService,
    private organizationService: OrganizationService,
    private router: Router
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd) {
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.loadMenus();
    this.organizationService.getOrganization();
    this.employeeService.getEmployee();
    //this.loadLanguages();
  }

  loadMenus() {
    this.service.getMenuTree()
      .then(data => {
        this.menus = null;
        setTimeout(() => this.menus = data, 0);
      })
      .catch(err => console.error(err));
    // this.menus = [
    //   {
    //     title: '菜单1', icon: 'fa fa-user', path: 'menu1', children: [
    //       { title: '菜单2', path: 'menu1' },
    //       { title: '菜单3', path: 'menu1' },
    //       { title: '菜单4', path: 'menu1' },
    //       { title: '菜单5', path: 'menu1' },
    //     ]
    //   },
    //   { title: '菜单2', icon: 'fa fa-user', path: 'menu1' },
    //   { title: '菜单3', icon: 'fa fa-user', path: 'menu1' },
    //   { title: '菜单4', icon: 'fa fa-user', path: 'menu1' },
    //   { title: '菜单5', icon: 'fa fa-user', path: 'menu1' },
    // ]
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

  onActivate(event) {
    alert(event);
  }
}
