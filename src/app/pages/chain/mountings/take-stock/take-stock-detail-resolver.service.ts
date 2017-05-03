import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TakeStockService } from './take-stock.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TakeStockDetailResolver implements Resolve<any> {
    constructor(
        private service: TakeStockService,
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any | Observable<any> | Promise<any> {
        let id = route.params['id'];
        if (!id) return null;
        return this.service.get(id);
    }
}