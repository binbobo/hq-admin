import { Injectable } from '@angular/core';
import { HttpService, UserService } from 'app/shared/services';
import { Urls } from '../shared/services/url.service';
import { StorageKeys, ApiResult } from 'app/shared/models';

@Injectable()
export class OrganizationService {
    constructor(
        private httpService: HttpService,
        private userService: UserService
    ) {
        this.userService.onUserLogout.subscribe(() => this.clearStorage());
    }

    private clearStorage() {
        sessionStorage.removeItem(StorageKeys.OrganizationInfo);
    }

    public getOrganization(): Promise<OrganizationInfo> {
        let cache = this.getFromStorage();
        if (cache) return Promise.resolve(cache);
        return this.getFromApi()
            .then(data => {
                sessionStorage.setItem(StorageKeys.OrganizationInfo, JSON.stringify(data));
                return data;
            });
    }

    private getFromStorage() {
        let key = StorageKeys.OrganizationInfo;
        let cache = sessionStorage.getItem(key);
        if (cache) {
            try {
                return JSON.parse(cache) as OrganizationInfo;
            } catch (error) {
                this.clearStorage();
                return null;
            }
        } else {
            return null;
        }
    }

    private getFromApi() {
        let url = Urls.chain.concat('/OrganizationInfos/Current');
        return this.httpService.get<ApiResult<OrganizationInfo>>(url)
            .then(result => result.data);
    }

}

export class OrganizationInfo {
    public id: string;
    public name: string;
    public code: string;
    public address: string;
    public contactUser: string;
    public contactInfo: string;
    public areaId: string;
    public serviceCall: string;
    public rescueCall: string;
}