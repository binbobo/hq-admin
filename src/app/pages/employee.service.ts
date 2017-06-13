import { Injectable } from '@angular/core';
import { HttpService, UserService } from 'app/shared/services';
import { Urls } from '../shared/services/url.service';
import { StorageKeys, ApiResult } from 'app/shared/models';

@Injectable()
export class EmployeeService {
    constructor(
        private httpService: HttpService,
        private userService: UserService
    ) {
        this.userService.onUserLogout.subscribe(() => this.clearStorage());
    }

    private clearStorage() {
        sessionStorage.removeItem(StorageKeys.EmployeeInfo);
    }

    private setStorage(data: any) {
        if (!data) return false;
        sessionStorage.setItem(StorageKeys.EmployeeInfo, JSON.stringify(data));
        return data;
    }

    public getEmployee(): Promise<EmployeeInfo> {
        let cache = this.getFromStorage();
        if (cache) return Promise.resolve(cache);
        return this.getFromApi().then(data => this.setStorage(data));
    }

    private getFromStorage() {
        let key = StorageKeys.EmployeeInfo;
        let cache = sessionStorage.getItem(key);
        if (cache) {
            try {
                return JSON.parse(cache) as EmployeeInfo;
            } catch (error) {
                this.clearStorage();
                return null;
            }
        } else {
            return null;
        }
    }

    private getFromApi() {
        let url = Urls.chain.concat('/Employees/Current');
        return this.httpService.get<ApiResult<EmployeeInfo>>(url)
            .then(result => result.data)
            .catch(err => Promise.resolve({}));
    }

}

export class EmployeeInfo {
    public id: string;
    public userId: string;
    public name: string;
    public code: string;
    public contactInfo: string;
    public status: string;
    public orgId: string;
    public modifiedReason: string;
}