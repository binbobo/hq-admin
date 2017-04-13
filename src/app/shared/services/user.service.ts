import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Urls } from 'app/shared/services';
import { StorageKeys } from 'app/shared/models';

@Injectable()
export class UserService {
    private _user: User;
    public onUserLogin = new EventEmitter<User>();
    public onUserLogout = new EventEmitter();
    public redirectUrl: string;

    constructor(
        private router: Router,
    ) {
        this.onUserLogin.subscribe(user => {
            this._user = user;
            this.saveStorage(user.permanent);
        });
        this.onUserLogout.subscribe(() => {
            this._user = null;
            this.clearStorage();
            this.redirectUrl = this.router.url;
            this.router.navigateByUrl('/login');
        });
        let user = this.user;
        if (user && user.token) {
            setTimeout(() => this.onUserLogin.emit(user), 0);
        }
    }

    private clearStorage() {
        localStorage.removeItem(StorageKeys.Identity);
        sessionStorage.removeItem(StorageKeys.Identity);
    }

    private saveStorage(permanent: boolean) {
        let json: string = JSON.stringify(this._user);
        sessionStorage.setItem(StorageKeys.Identity, json);
        if (permanent) {
            localStorage.setItem(StorageKeys.Identity, json);
        }
    }

    get user(): User {
        return this._user || this.getUserFromStroage();
    }

    private getUserFromStroage() {
        let userJson = sessionStorage.getItem(StorageKeys.Identity) || localStorage.getItem(StorageKeys.Identity);
        if (!userJson) return null;
        try {
            let user = JSON.parse(userJson) as User;
            return user && user.token ? user : null;
        } catch (error) {
            this.clearStorage();
            return null;
        }
    }

    public redirect(): void {
        var url = this.redirectUrl || '/';
        console.info('跳转至', url);
        this.router.navigate([url]);
    }
}

export class User {
    constructor(
        public id?: string,
        public username?: string,
        public email?: string,
        public token?: string,
        public refreshToken?: string,
        public permanent?: boolean
    ) { }
}