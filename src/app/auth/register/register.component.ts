import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlerterService } from "app/shared/services";
import { AuthService, RegisterRequestModel } from "app/auth/auth.service";
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private form: FormGroup;
  private alerter: AlerterService = new AlerterService();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
  ) { }

  ngOnInit() {
    this.buidForm();
  }

  private buidForm(): void {
    let password = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20)
    ]);
    let certainPassword = new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
      CustomValidators.equalTo(password)
    ]);
    this.form = this.formBuilder.group({
      'username': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      password,
      certainPassword
    });
  }

  private onSubmit() {
    let model = this.form.value as RegisterRequestModel;
    this.authService
      .register(model)
      .then(() => {
        this.alerter.success('用户注册成功！');
        setTimeout(() => this.route.navigate(['/login']), 1000);
      })
      .catch(err => this.alerter.error(err));
  }
}
