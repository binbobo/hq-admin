import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions } from '@angular/http';
import { UserService } from "app/shared/services/user.service";
import { TranslateService } from '@ngx-translate/core';
import { EventDispatcher } from './event-dispatcher.service';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {

    constructor(
        private userService: UserService,
        private dispatcher: EventDispatcher,
    ) {
        super();
        let user = userService.user;
        this.setAuthorization(user);
        this.headers.append('Content-Type', 'application/json');
        userService.onUserLogin.subscribe(user => this.setAuthorization(user));
        this.dispatcher.subscribe('LanguageChanged', lang => this.setAcceptLanguage(lang))
    }

    private setAcceptLanguage(lang) {
        this.headers.set('Accept-Language', lang.culture || navigator.language);
    }

    private setAuthorization(user) {
        if (user && user.token) {
            this.headers.set('Authorization', `Bearer ${user.token}`);
        }
    }
}

export const requestOptionsProvider = { provide: RequestOptions, useClass: DefaultRequestOptions };