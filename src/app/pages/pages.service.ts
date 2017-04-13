import { Injectable } from '@angular/core';
import { LanguageService } from './locale/language/language.service';
import { MenuService } from './settings/menu/menu.service';

@Injectable()
export class PagesService {

    constructor(
        private menuService: MenuService,
        private languageService: LanguageService,
    ) { }

    public getMenuTree(): Promise<Array<any>> {
        return this.menuService.getMenuTree();
    }

    public getLanguages(): Promise<Array<any>> {
        return this.languageService.getAvailableList(true);
    }
}