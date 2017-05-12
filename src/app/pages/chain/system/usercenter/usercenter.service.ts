import { Injectable } from "@angular/core"
import { Urls, HttpService } from "app/shared/services";
import { PagedParams, ListResult, PagedResult, ApiResult, BasicModel, BasicService, RequestParams, SelectOptionGroup, SelectOption } from 'app/shared/models';
import { TreeviewItem, TreeviewConfig } from "ngx-treeview"

@Injectable()
export class UserCenterService implements BasicService<any>{
    private static Url_Chain_UserSearch: string = "/SystemManager/Search";
    private static Url_Chain_CreateUser: string = "/SystemManager";
    private static Url_Chain_PositionOption: string = "/Positions/Options";
    private static Url_Chain_DepartmentOption: string = "/Departments/Options/Position";

    private static Url_Platfrom_Enabled: string = "Users/Enabled/";
    private static Url_Platfrom_ResetPassword: string = "Users/ResetPassword/";
    private static Url_Platfrom_RoleOption: string = "/Roles/Options";

    constructor(
        private httpService: HttpService
    ) {

    }

    /**
     * 创建用户
     */
    public create(body: any): Promise<any> {
        let url = Urls.chain.concat(UserCenterService.Url_Chain_CreateUser);
        // url = "http://localhost:8022/api/SystemManager";
        return this.httpService.post(url, JSON.stringify(body))
            .then(result => { })
            .catch(result => { });
    }
    public update(body: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public patch(body: any): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public delete(id: string): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /**
     * 搜索用户列表
     */
    public getPagedList(params: UserPageparams): Promise<PagedResult<UserModel>> {
        let url = Urls.chain.concat(UserCenterService.Url_Chain_UserSearch);
        // url = "http://localhost:8022/api/SystemManager/Search";

        return this.httpService
            .get<PagedResult<UserModel>>(url, params.serialize())
            .then(item => {
                return item;
            })
            .catch(err => Promise.reject(`加载用户列表失败：${err}`));
    }

    /**
     * 获取职位下拉列表
     */
    public getPositionOptions(): Promise<TreeviewItem[]> {
        let url = Urls.platform.concat(UserCenterService.Url_Chain_DepartmentOption);
        // url = "http://localHost:8022/api".concat(UserCenterService.Url_Chain_DepartmentOption);

        return this.httpService.get<ListResult<TreeviewItem>>(url)
            .then(item =>this.TreeView(item.data));
    }

    private TreeView(items:TreeviewItem[]):TreeviewItem[]{
        for (let i=0;i<items.length;i++){
            items[i]=new TreeviewItem({text:items[i].text,value:items[i].value,checked:false});
            if(items[i].children) this.TreeView(items[i].children)
        }
        return items;
    }

    public SelectedTreeNode(items:TreeviewItem[],nodes:string[]){
        for (let i=0;i<items.length;i++){
            let item=items[i];
            //if(item.children) this.SelectedTreeNode(item.children,nodes)
            if(nodes.filter(x=>x==item.value).length>0) item.checked=true; 
        }
    }
    /**
     * 获取角色下拉列表
     */
    public getRolesOptions(): Promise<TreeviewItem[]> {
        let url = Urls.platform.concat(UserCenterService.Url_Platfrom_RoleOption);
        // url = "http://localHost:8020/api".concat(UserCenterService.Url_Platfrom_RoleOption);

        return this.httpService.get<ListResult<SelectOption>>(url, `type=${RoleEnum.User.toString()}`)
            .then(item => {
                return item.data.map(x => new TreeviewItem({ text: x.text, value: x.value,checked:false }))
            });
    }

    /**
     * 冻结、解冻 用户
     * true:解冻 False:冻结
     */
    public EnabledUser(id, isEnabled: boolean): Promise<void> {
        let url = Urls.platform.concat(UserCenterService.Url_Platfrom_Enabled, id);
        // url = "http://localhost:8020/api/Users/Enabled/" + id;
        return this.httpService.
            put<void>(url, { Enabled: isEnabled })
            .then(item => alert(`${isEnabled ? "解冻" : "冻结"}：成功`))
            .catch(err => Promise.reject(`${isEnabled ? "解冻" : "冻结"}：${err}`));
        // return this.httpService.put(url,)
    }

    /**
     * 重置用户密码
     */
    public ResetPassword(id): Promise<void> {
        let url = Urls.platform.concat(UserCenterService.Url_Chain_UserSearch, id);
        // url = "http://localhost:8020/api/Users/ResetPassword/" + id;
        return this.httpService.
            put<void>(url, {})
            .catch(err => Promise.reject(`重置密码：${err}`));
        // return this.httpService.put(url,)
    }

    public get(id: string): Promise<UserModel> {
        throw new Error('Method not implemented.');
    }

    public get rolesDropDown(): DropDownItem {
        return new DropDownItem([
            new TreeviewItem({
                text: "第一页", value: "123", children: [
                    { text: "生成", value: "1" },
                    { text: "生成2", value: "2" },
                    { text: "生成3", value: "3" },
                ]
            }),
            new TreeviewItem({
                text: "第二页", value: "222", children: [
                    { text: "二生成", value: "11" },
                    { text: "二生成2", value: "22" },
                    { text: "二生成3", value: "33" },
                ]
            })
        ]);
    }

    public get getPositionsDropDown(): DropDownItem {

        return new DropDownItem([
            new TreeviewItem({
                text: "人力资源部", value: "123", children: [
                    { text: "职位一", value: "1" },
                    { text: "职位二", value: "2" },
                    { text: "职位三", value: "3" },
                ]
            }),
            new TreeviewItem({
                text: "信息部", value: "222", children: [
                    { text: "职位一", value: "11" },
                    { text: "职位二", value: "22" },
                    { text: "职位三", value: "33" },
                ]
            })
        ]);
    }
}

/**
 * 用户结构
 */
export class UserModel {
    id: string;
    name: string;
    phone: string;
    enabled: boolean;
    createTime: string;
    description: string;
    roles: UserRole[];
    roleIds: string[];
    positionIds: string[];
    partPositionItems: PartPositionInfo[];
    userRoleName: string;
    positionName: string;
    partName: string;

    public ClearData(){
        this.id="";
        this.name="";
        this.phone="";
        this.enabled=false;
        this.createTime="";
        this.description="";
        this.roles=[];
        this.roleIds=[];
        this.positionIds=[];
        this.positionName="";
        this.userRoleName="";
        this.partName="";
    }
}

/**
 * 用户下的角色
 * ID
 * name 名称
 */
export class UserRole {
    id: string;
    name: string;
}

export class PartPositionInfo {
    id: string;
    name: string;
    positionItems: PostionInfo[];
}

export class PostionInfo {
    id: string;
    name: string;
}

/**
 * 下拉列表模型
 */
export class DropDownItem {
    public config = {
        isShowAllCheckBox: false,
        isShowFilter: true,
        isShowCollapseExpand: true,
        maxHeight: 500
    };
    public callBack: Function;
    constructor(public items: TreeviewItem[], callBack?: Function, config?: TreeviewConfig) {
        if (config != null) this.config = config;
        if (callBack != null) this.callBack = callBack;
    }
}

/**
 * 用户搜索参数
 */
export class UserPageparams extends PagedParams {
    constructor(
        //用户姓名查询
        public keyWord?: any, // 姓名/手机
    ) {
        super('UserListSearchParams');
    }
}

/**
 * 角色类型
 */
export enum RoleEnum {
    /**
     * 所有的角色
     */
    None = 0,
    /**
     * 用户角色
     */
    User = 1,
    /**
     * 租户角色
     */
    Tenant = 2
}
