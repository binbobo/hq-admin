import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Application, ApplicationService } from './application.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppDetailResolverService implements Resolve<Application>{

  constructor(
    private service: ApplicationService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Application | Observable<Application> | Promise<Application> {
    let id = route.params['id'];
    if (!id) return null;
    return this.service.get(id)
  }
}