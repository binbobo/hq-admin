import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Property, PropertyService } from './property.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PropertyDetailResolver implements Resolve<Property> {

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Property | Observable<Property> | Promise<Property> {
        let id = route.params['id'];
        if (!id) return null;
        return this.service.get(id);
    }

    constructor(
        private service: PropertyService
    ) { }
}