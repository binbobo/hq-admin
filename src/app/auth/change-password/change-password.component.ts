import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HqAlerter } from 'app/shared/directives';
import { AuthService, ChangePasswordRequest } from '../auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { Location } from '@angular/common';

@Component({
  selector: 'hq-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  private form: FormGroup;
  @ViewChild(HqAlerter)
  private alerter: HqAlerter;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private location: Location,
    private route: Router,
  ) { }

  ngOnInit() {
    this.buidForm();
  }

  private buidForm(): void {
    let newPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]);
    let certainPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      CustomValidators.equalTo(newPassword)
    ]);
    this.form = this.formBuilder.group({
      oldPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      newPassword,
      certainPassword
    });
  }

  private onSubmit() {
    let formValue = this.form.value;
    let model = new ChangePasswordRequest(formValue.oldPassword, formValue.newPassword);
    this.authService
      .changePassword(model)
      .then(() => {
        this.alerter.success('修改密码成功，请重新登录！');
        setTimeout(() => this.route.navigate(['/auth/logout']), 1000);
      })
      .catch(err => this.alerter.error(err));
  }
}
