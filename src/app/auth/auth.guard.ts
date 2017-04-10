import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from 'app/shared/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;
    if (this.userService.user) {
      return true;
    }
    this.userService.redirectUrl = url;
    this.userService.onUserLogout.emit();
    return false;
  }
}
