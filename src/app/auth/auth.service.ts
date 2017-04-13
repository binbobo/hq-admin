import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Urls, User } from 'app/shared/services';

@Injectable()
export class AuthService {

  constructor(
    private http: Http,
  ) { }

  public login(model: LoginRequestModel): Promise<User> {
    const url = Urls.platform.concat('users/login');
    let basic = btoa(`${model.username}:${model.password}`);
    let headers = new Headers({ 'Authorization': `Basic ${basic}` });
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
        console.error(err);
        return Promise.reject(`用户登录失败！`);
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

  public logout(user: User): Promise<void> {
    const url = Urls.platform.concat('users/logout?token=', user.token);
    return this.http.get(url).toPromise().then(resp => { });
  }
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