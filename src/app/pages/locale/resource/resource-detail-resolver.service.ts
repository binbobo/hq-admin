import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Resource, ResourceService } from './resource.service';

@Injectable()
export class ResourceDetailResolver implements Resolve<Resource> {

    constructor(
        private service: ResourceService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Resource | Observable<Resource> | Promise<Resource> {
        let id = route.params['id'];
        if (!id) return null;
        return this.service.get(id);
    }
}
