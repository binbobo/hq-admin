import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ClientService, Client } from './client.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ClientDetailResolver implements Resolve<Client> {

  constructor(private service: ClientService) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Client | Observable<Client> | Promise<Client> {
    let id = route.params['id'];
    if (!id) return null;
    return this.service.get(id)
  }
}