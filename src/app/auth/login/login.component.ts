import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService, LoginRequestModel } from '../auth.service';
import { UserService, User } from "app/shared/services";
import { HqAlerter } from 'app/shared/directives';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  private form: FormGroup;
  @ViewChild(HqAlerter)
  private alerter: HqAlerter;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    let user = this.userService.user;
    if (user && user.token) {
      this.userService.redirect();
      return;
    }
    this.buidForm();
  }

  private buidForm(): void {
    this.form = this.formBuilder.group({
      'username': ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      'rememberMe': [false],
    });
  }

  private onSubmit() {
    let model = this.form.value as LoginRequestModel;
    this.authService
      .login(model)
      .then(user => {
        this.alerter.success('登录成功！');
        this.userService.onUserLogin.emit(user);
        this.userService.redirect();
      })
      .catch(err => {
        this.alerter.clear();
        this.alerter.error(err);
      });
  }
}
