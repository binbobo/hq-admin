import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Urls, User, HttpService } from 'app/shared/services';

@Injectable()
export class AuthService {

  constructor(
    private http: Http,
    private httpService: HttpService
  ) { }

  public login(model: LoginRequestModel): Promise<User> {
    const url = Urls.platform.concat('users/login');
    let basic = btoa(`${model.username}:${model.password}`);
    let headers = new Headers({ 'Authorization': `Basic ${basic}` });
    headers.append('X-Application', '9951112f8dd2b0e52597c27197f1121c');
    headers.append('X-Client', 'bc54f4d60f1cec0f9a6cb70e13f2127a');
    return this.http.get(url, { 'headers': headers })
      .toPromise()
      .then(resp => {
        let json = resp.json();
        if (!json || !json.data) {
          Promise.reject('接口返回异常！');
        }
        let user = json.data as LoginResponseModel;
        return new User(user.id, model.username, null, user.accessToken, user.refreshToken, model.rememberMe);
      })
      .catch(err => {
        if (err.status === 404) {
          return Promise.reject('用户不存在！');
        } else {
          return Promise.reject(this.httpService.getErrors(err));
        }
      });
  }

  public register(model: RegisterRequestModel): Promise<void> {
    const url = Urls.platform.concat('/users');
    let data = { account: model.username, password: model.password };
    return this.http.post(url, data)
      .toPromise()
      .then(resp => { })
      .catch(err => Promise.reject('用户注册失败！'));
  }

  public changePassword(model: ChangePasswordRequest): Promise<void> {
    let url = Urls.platform.concat('/users/changepassword');
    return this.httpService.put<void>(url, model)
      .catch(err => Promise.reject(`修改密码失败:${err}`));
  }

  public logout(user: User): Promise<void> {
    const url = Urls.platform.concat('users/logout?token=', user.token);
    return this.http.get(url).toPromise().then(resp => { });
  }
}

export class ChangePasswordRequest {
  constructor(
    public oldPassword: string,
    public newPassword: string
  ) { }
}

export class LoginRequestModel {
  constructor(
    public username: string,
    public password: string,
    public rememberMe: boolean
  ) { }
}

export class LoginResponseModel {
  constructor(
    public accessToken?: string,
    public refreshToken?: string,
    public id?: string,
  ) { }
}

export class RegisterRequestModel {
  constructor(
    public username: string,
    public password: string,
  ) { }
}