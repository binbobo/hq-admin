import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Urls } from 'app/shared/services';
import { StorageKeys } from 'app/shared/models';

@Injectable()
export class UserService {
    public onUserLogin = new EventEmitter<User>();
    public onUserLogout = new EventEmitter();
    public redirectUrl: string;

    constructor(
        private router: Router,
    ) {
        this.onUserLogin.subscribe(user => {
            this.saveStorage(user);
        });
        this.onUserLogout.subscribe(() => {
            this.clearStorage();
            this.redirectUrl = this.router.url;
            window.location.href = '/auth/login';
            //this.router.navigateByUrl('/auth/login');
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

    private saveStorage(user) {
        let json: string = JSON.stringify(user);
        sessionStorage.setItem(StorageKeys.Identity, json);
        if (user.permanent) {
            localStorage.setItem(StorageKeys.Identity, json);
        }
    }

    get user(): User {
        return this.getUserFromStorage();
    }

    private getUserFromStorage() {
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
        let url = this.redirectUrl || '/';
        url = url.includes('login') ? '/' : url;
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