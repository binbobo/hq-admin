import { Injectable } from '@angular/core';
import { GroupService, Group } from './group.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GroupDetailResolver implements Resolve<Group> {

    constructor(
        private service: GroupService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Group | Observable<Group> | Promise<Group> {
        let id = route.params['id'];
        if (!id) return null;
        return this.service.get(id);
    }
}