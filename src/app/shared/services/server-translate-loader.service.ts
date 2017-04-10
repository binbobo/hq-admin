import { Injectable } from '@angular/core';
import { TranslateLoader } from "@ngx-translate/core";
import { Urls } from './url.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServerTranslateLoader implements TranslateLoader {
    
    constructor(
        private http: HttpService
    ) { }

    getTranslation(lang: string): Observable<any> {
        let url = Urls.localization.concat('/groups/ng2admin/resources');
        return this.http.request(url).map(resp => resp.json());
    }
}