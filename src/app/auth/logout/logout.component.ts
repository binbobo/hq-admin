import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/shared/services';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.onUserLogout.emit();
    setTimeout(() => this.userService.redirectUrl = null, 100);
  }

}
