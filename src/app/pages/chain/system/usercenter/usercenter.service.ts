import { Injectable } from "@angular/core"
import { Urls, HttpService } from "app/shared/services";
import { PagedParams, ListResult, PagedResult, ApiResult, BasicModel, BasicService, RequestParams, SelectOptionGroup, SelectOption } from 'app/shared/models';
import { TreeviewItem, TreeviewConfig } from "ngx-treeview"

@Injectable()
export class UserCenterService implements BasicService<any>{
    private static Url_Chain_UserSearch: string = "/SystemManager/Search";
    private static Url_Chain_CreateUser: string = "/SystemManager";
    private static Url_Chain_EditUser: string = "/SystemManager/EditUserInfo/";

    private static Url_Chain_PositionOption: string = "/Positions/Options";
    private static Url_Chain_DepartmentOption: string = "/Departments/Options/Position";

    private static Url_Platfrom_Enabled: string = "Users/Enabled/";
    private static Url_Platfrom_ResetPassword: string = "Users/ResetPassword/";
    private static Url_Platfrom_RoleOption: string = "Roles/Options";

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
            .then(result => result)
            .catch(error => Promise.reject(`新增用户失败： ${error}`));
    }
    /**
     * 编辑更新
     */
    public update(body: any): Promise<any> {
        let url = Urls.chain.concat(UserCenterService.Url_Chain_EditUser,body.id);
        // url = "http://localhost:8022/api/SystemManager/EditUserInfo/"+body.id;
        return this.httpService.put<void>(url,JSON.stringify(body))
                                .then(result=>result)
                                .catch(error=>Promise.reject(`编辑用户失败：${error}`));
    }
    public patch(body: any): Promise<void> {
        return Promise.reject('Method not implemented.')
    }
    public delete(id: string): Promise<void> {
        return Promise.reject('Method not implemented.')
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
        let url = Urls.chain.concat(UserCenterService.Url_Chain_DepartmentOption);
        // url = "http://localHost:8022/api".concat(UserCenterService.Url_Chain_DepartmentOption);

        return this.httpService.get<ListResult<TreeviewItem>>(url)
            .then(item => item.data);
    }

    /**
     * 获取角色下拉列表
     */
    public getRolesOptions(): Promise<TreeviewItem[]> {
        let url = Urls.platform.concat(UserCenterService.Url_Platfrom_RoleOption);
        // url = "http://localHost:8020/api/".concat(UserCenterService.Url_Platfrom_RoleOption);

        return this.httpService.get<ListResult<SelectOption>>(url, `type=${RoleEnum.None.toString()}`)
            .then(item => {
                return item.data.map(x => new TreeviewItem({ text: x.text, value: x.value, checked: false }))
            })
            .catch(error => Promise.reject(`获取角色选项失败： ${error}`));
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
        let url = Urls.platform.concat(UserCenterService.Url_Platfrom_ResetPassword, id);
        // url = "http://localhost:8020/api/Users/ResetPassword/" + id;
        return this.httpService.
            put<void>(url, {})
            .catch(err => Promise.reject(`重置密码：${err}`));
    }

    public get(id: string): Promise<UserModel> {
        throw new Error('Method not implemented.');
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
    createTime:string;
    description: string;
    roles: UserRole[];
    roleIds: string[];
    positionIds: string[];
    partPositionItems: PartPositionInfo[];
    userRoleName: string;
    positionName: string;
    partName: string;
    passWord:string;

    public ClearData() {
        this.id = "";
        this.name = "";
        this.phone = "";
        this.enabled = false;
        this.createTime = "";
        this.description = "";
        this.roles = [];
        this.roleIds = [];
        this.positionIds = [];
        this.positionName = "";
        this.userRoleName = "";
        this.partName = "";
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

/**
 * 部门信息
 */
export class PartPositionInfo {
    id: string;
    name: string;
    /**
     * 职位
     */
    positionItems: PostionInfo[];
}

/**
 * 职位信息
 */
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
    constructor(public items: TreeviewItem[], config?: TreeviewConfig) {
        if (config != null) this.config = config;
    }

    /**
     * 创建树节点
     */
    public CreateTreeViewNodes(items: TreeviewItem[]): TreeviewItem[] {
        if (!items) return;
        this.CopeyTreeViewItems(items);
        this.items =items;
        return items;
    }

    /**
     * 在下拉选项中 选择 nodes数组中的节点
     */
    public SelectedTreeNode(nodes: string[]) {
        if (!nodes) return;
        this.SelectedNodes(this.items, nodes);
        return this.items;
    }

    /**
     * 创建新的节点
     */
    private CopeyTreeViewItems(items: TreeviewItem[]) {
        for (let i = 0; i < items.length; i++) {
            let model = new TreeviewItem({ text: items[i].text, value: items[i].value, checked: false });
            model.children = items[i].children;
            items[i] = model;
            if (items[i].children) this.CopeyTreeViewItems(items[i].children)
        }
    }
    /**
     * 循环比对下拉列表中的节点是否是需要进行选择的
     */
    private SelectedNodes(items: TreeviewItem[], nodes: string[]) {
        if (!items || !nodes) return;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.children) {
                this.SelectedNodes(item.children, nodes);
                item.checked=item.getCheckedItems().length==item.children.length
                continue;
            }
            this.CheckedNodes(item, nodes);
        }
    }

    /**
     * 选择节点
     */
    private CheckedNodes(item: TreeviewItem, nodes: string[]) {
        if (!item || !nodes || !item.value) return;
        for (let n = 0; n < nodes.length; n++) { 
        // console.log(item.text+" "+item.value+"|"+ (nodes[n] == item.value)+"|"+nodes.length);
            if (nodes[n] == item.value) {
                item.checked = true;
                break;
            }
        }
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
