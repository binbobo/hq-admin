import {Injectable} from "@angular/core"
import { Urls, HttpService } from "app/shared/services";
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService,RequestParams} from 'app/shared/models';
import {TreeviewItem,TreeviewConfig} from "ngx-treeview"
@Injectable()
export class UserCenterService implements BasicService<any>{
    private static Url_UserSearch:string="/SystemManager/Search";
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

    getPagedList(params: UserPageparams): Promise<PagedResult<UserModel>>{
        let url=Urls.chain.concat(UserCenterService.Url_UserSearch);
        url="http://localhost:8022/api/SystemManager/Search";

       return this.httpService
            .get<PagedResult<UserModel>>(url,params.serialize())
            .then(item=>{
                return item;
            })
            .catch(err => Promise.reject(`加载工单列表失败：${err}`));
    }

    get(id: string): Promise<UserModel>{
         throw new Error('Method not implemented.');
    }

   get rolesDropDown():DropDownItem{
        return new DropDownItem([
                    new TreeviewItem({text:"第一页",value:"123",children:[
                        {text:"生成",value:"1"},
                        {text:"生成2",value:"2"},
                        {text:"生成3",value:"3"},
                    ]}),
                    new TreeviewItem({text:"第二页",value:"222",children:[
                        {text:"二生成",value:"11"},
                        {text:"二生成2",value:"22"},
                        {text:"二生成3",value:"33"},
                    ]})
                    ]);
    }

    get positionsDropDown():DropDownItem{
        return new DropDownItem([
                    new TreeviewItem({text:"人力资源部",value:"123",children:[
                        {text:"职位一",value:"1"},
                        {text:"职位二",value:"2"},
                        {text:"职位三",value:"3"},
                    ]}),
                    new TreeviewItem({text:"信息部",value:"222",children:[
                        {text:"职位一",value:"11"},
                        {text:"职位二",value:"22"},
                        {text:"职位三",value:"33"},
                    ]})
                    ]);
    }
}

export class UserModel{
    id :string;
    name:string;
    phone:string;
    enabled:boolean;
    createTime:string;
    description:string;
    roles:UserRole[];
    partPositionItems:PartPositionInfo[];
    userRoleName:string;
    positionName:string;
    partName:string;
}

export class UserRole
{
    id:string;
    name:string;
}

export class PartPositionInfo{
    id:string;
    name:string;
    positionItems:PostionInfo[];
}

export class PostionInfo{
    id:string;
    name:string;
}


export class DropDownItem{
   public config={
            isShowAllCheckBox: true,
            isShowFilter: true,
            isShowCollapseExpand: true,
            maxHeight: 500
        };
   public callBack:Function;
  constructor(public items:TreeviewItem[], callBack?:Function,config?:TreeviewConfig){
      if(config!=null) this.config=config;
      if(callBack!=null) this.callBack=callBack;
  }
}

export class UserPageparams extends PagedParams{
    constructor(
        //用户姓名查询
        public keyWord?: any, // 姓名/手机
    ) {
        super('UserListSearchParams');
    }
}
