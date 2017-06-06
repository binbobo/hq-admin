import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions } from '@angular/http';
import { UserService } from "app/shared/services/user.service";
import { EventDispatcher } from './event-dispatcher.service';
import * as moment from 'moment';

@Injectable()
export class DefaultRequestOptions extends BaseRequestOptions {

    constructor(
        private userService: UserService,
        private dispatcher: EventDispatcher,
    ) {
        super();
        let user = userService.user;
        this.setAuthorization(user);
        let utfOffset = moment().utcOffset();
        this.headers.append('x-timezoneutc', utfOffset.toString());
        this.headers.append('X-Application', '9951112f8dd2b0e52597c27197f1121c');
        this.headers.append('X-Client', 'bc54f4d60f1cec0f9a6cb70e13f2127a');
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
export const defaultRequestOptionProvider = { provide: RequestOptions, useClass: BaseRequestOptions }