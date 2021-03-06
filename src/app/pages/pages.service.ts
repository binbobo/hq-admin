import { Injectable } from '@angular/core';
import { LanguageService } from './locale/language/language.service';
import { MenuService } from './settings/menu/menu.service';
import { Urls, HttpService } from 'app/shared/services';
import { ListResult } from 'app/shared/models';

@Injectable()
export class PagesService {

    constructor(
        private menuService: MenuService,
        private httpService: HttpService,
        private languageService: LanguageService,
    ) { }

    public getMenuTree(): Promise<Array<any>> {
        let url = Urls.platform.concat('/users/clientMenus?key=PC');
        return this.httpService.getList<any>(url)
            .catch(err => console.error(err));
        //return this.menuService.getMenuTree();
    }

    public getLanguages(): Promise<Array<any>> {
        return this.languageService.getAvailableList(true);
    }

    public getOrganizationInfo() {
        let url = Urls.chain.concat('/OrganizationInfos/Current');
        return this.httpService.get<any>(url);
    }
}