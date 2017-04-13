import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    let user = this.userService.user;
    this.authService.logout(user);
    this.userService.onUserLogout.emit();
    setTimeout(() => this.userService.redirectUrl = null, 100);
  }

}
