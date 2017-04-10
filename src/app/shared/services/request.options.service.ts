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
        if (user && user.token) {
            this.headers.set('Authorization', `Bearer ${user.token}`);
        }
        this.dispatcher.subscribe('LanguageChanged', lang => {
            console.log(lang);
            this.headers.set('Accept-Language', lang || navigator.language);
        })
        this.headers.set('Content-Type', 'application/json');
    }
}

export const requestOptionsProvider = { provide: RequestOptions, useClass: DefaultRequestOptions };