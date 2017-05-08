import {Injectable} from "@angular/core"
import { Urls, HttpService } from "app/shared/services";
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService, ListResult, SelectOption } from 'app/shared/models';

@Injectable()
export class UserCenterService implements BasicService<any>{
    constructor(
        private httpService: HttpService
    ){

    }

    create(body: any): Promise<any> {
        throw new Error('Method not implemented.');
    }
    update(body: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    patch(body: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<void>{
         throw new Error('Method not implemented.');
    }

    getPagedList(params: PagedParams): Promise<PagedResult<UserModel>>{
        let model:Array<UserModel>=[
            new UserModel(),
            new UserModel(),
            new UserModel()
        ];
        
         return new Promise(null);
    }
    get(id: string): Promise<UserModel>{
         throw new Error('Method not implemented.');
    }
}

class UserModel{
    id :string="1001";
    account:string="kkis";
    name:string;
    avatar:string;
    mobile:string;
    email:string;
    roleIds:string[];
    tenantIds :string;
}