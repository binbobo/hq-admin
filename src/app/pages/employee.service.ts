import { Injectable } from '@angular/core';
import { HttpService, UserService } from 'app/shared/services';
import { Urls } from '../shared/services/url.service';
import { StorageKeys } from 'app/shared/models';

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

    public getEmployee(): Promise<EmployeeInfo> {
        let cache = this.getFromStorage();
        if (cache) return Promise.resolve(cache);
        return this.getFromApi()
            .then(data => {
                sessionStorage.setItem(StorageKeys.EmployeeInfo, JSON.stringify(data));
                return data;
            });
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
        let url = Urls.platform.concat('/Employees/Current');
        return this.httpService.get<EmployeeInfo>(url);
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