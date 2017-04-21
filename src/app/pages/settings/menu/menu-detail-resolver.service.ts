import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Menu, MenuService } from './menu.service';

@Injectable()
export class MenuDetailResolver implements Resolve<Menu>{

    constructor(
        private service: MenuService,
        private router: Router,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Menu | Observable<Menu> | Promise<Menu> {
        let id = route.params['id'];
        if (!id) return null;
        return this.service
            .get(id)
            .then(m => {
                m.parentId = m.parentId || "";
                m.scopes = m.scopes || [];
                return m;
            })
    }

}