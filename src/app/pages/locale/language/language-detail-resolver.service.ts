import { Injectable } from '@angular/core';
import { LanguageService, Language } from './language.service';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LanguageDetailResolver implements Resolve<Language>{

    constructor(
        private service: LanguageService,
        private router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Language | Observable<Language> | Promise<Language> {
        let id = route.params['id'];
        if (!id) return null;
        return this.service.get(id);
    }

}