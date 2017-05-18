import { Component, OnInit } from '@angular/core';
import { UserCenterService, UserModel, DropDownItem, UserPageparams } from "./usercenter.service"
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TreeviewItem, TreeviewConfig } from "ngx-treeview"

@Component({
  selector: 'hq-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.css']
})
export class UsercenterComponent implements OnInit {

  constructor(
    protected service: UserCenterService,
    private builder: FormBuilder
  ) { }

  /**搜索条件 */
  userSearch: FormGroup; 
  /**
   * 表单 创建用户模型
   */
  createUserModel: FormGroup;

  listUserModels: UserModel[]; //列表用户
  /**
   * 角色下拉列表数据
   */
  roleItem: DropDownItem = new DropDownItem([]);
  /**
   * 职位下拉列表数据
   */
  position: DropDownItem = new DropDownItem([]);

  params: UserPageparams; //请求参数

  /**
   * 创建 和 编辑 使用的用户模型
   */
  userModel: UserModel = new UserModel();

  /**true:新建 false:编辑 */
  isCreateOrEdit: boolean;

  protected total: number = 0;
  protected index: number = 1;
  protected size: number = 10;
  protected loading: boolean;
  protected list: Array<UserModel>;

  ngOnInit() {
    this.isCreateOrEdit = true;
    this.userSearch = this.builder.group({
      keyword: ""
    });

    this.createUserModel = this.builder.group({
      UserName: ["", [Validators.required]],
      Phone: ["", [Validators.required, Validators.pattern("^1[3|4|5|7|8][0-9]{9}$")]],
      Remark: ["",[Validators.maxLength(500)]],
      PassWord:""
    });

    this.params = new UserPageparams();

    this.roleItem.config.isShowAllCheckBox=true;
    this.service.getRolesOptions().then(item => {
     this.roleItem.items = item;
    });
    this.service.getPositionOptions().then(item => {
      this.position.CreateTreeViewNodes(item)
    });

    this.getPageList()
  }
  /**
   * 打开用户编辑界面
   */
  openEditorUser(event, userModel: UserModel) {
    // this.userModel=userModel;
    if(userModel.enabled==false) return;

    
    this.userModel.ClearData();
    this.userModel.name = userModel.name;
    this.userModel.phone = userModel.phone;
    this.userModel.description = userModel.description;
    this.userModel.positionIds = userModel.positionIds;
    this.userModel.roleIds = userModel.roleIds;
    this.userModel.createTime=userModel.createTime;
    this.userModel.id=userModel.id;

    this.position.items.forEach(x => { x.setCheckedRecursive(false);x.setCollapsedRecursive(false);});
    this.roleItem.items.forEach(x => { x.setCheckedRecursive(false);x.setCollapsedRecursive(false);});

    if(this.position) this.position.SelectedTreeNode(this.userModel.positionIds)
    if(this.roleItem) this.roleItem.SelectedTreeNode(this.userModel.roleIds)
    
    this.isCreateOrEdit = false;
    event.show();
  }
  
  /**
   *打开创建用户界面
   */
  openCreateUser(event) {
    this.userModel.ClearData();
    this.isCreateOrEdit = true;
    this.position.items.forEach(x => { x.setCheckedRecursive(false); x.setCollapsedRecursive(false); });
    this.roleItem.items.forEach(x => { x.setCheckedRecursive(false); x.setCollapsedRecursive(false); });
    event.show();
  }

  /**获取用户列表 */
  getPageList() {
    if (this.loading) return;
    this.params.pageIndex = 1;
    this.loading = true;
    this.listUserModels = null;
    this.service.getPagedList(this.params)
      .then(item => {
        this.loading = false;
        if (item.data) {
          item.data.forEach(x => {
            x.userRoleName = x.roles.map(d => d.name).join(",");
            x.roleIds = x.roles.map(d => d.id);
            if (x.partPositionItems) {
              x.positionName = x.partPositionItems.map(d => d.positionItems.map(e => e.name)).join(",");
              x.partName = x.partPositionItems.map(d => d.name).join(",");
              x.positionIds=[];
              x.partPositionItems.map(d => {
                x.positionIds.push.apply(x.positionIds,d.positionItems.map(e => e.id))
                //d.positionItems.map(e => e.id).forEach(d=>x.positionIds.push(d))
              })
            }
          })
          this.listUserModels = item.data;
          this.list = item.data;
          this.total = item.totalCount;
          this.params.save();
        }

      }).catch(x => {
        this.loading = false;
      })
  }

  /** 新建 OR 编辑用户信息 */
  createOrUpdateUser(event) {
    if(this.createUserModel.valid==false) return;

    if (event.isRequest) return;
    event.isRequest = true;

    let userInfoModel:any= {
      Name: this.userModel.name,
      Phone: this.userModel.phone,
      Description: this.userModel.description,
      Roles: this.userModel.roleIds,
      Positions: this.userModel.positionIds
    }

    let reponse;
    if (this.isCreateOrEdit) {
      userInfoModel.passWord=this.userModel.passWord;
      reponse = this.service.create(userInfoModel)

    } else {
      userInfoModel.id=this.userModel.id;
      reponse = this.service.update(userInfoModel);
    }

    reponse.then(result => {
      this.getPageList();
      event.isRequest = false;
      event.hide();
     })
      .catch(item => {
        event.isRequest = false;
        alert(item);
      })
  }

  /**冻结 OR 解冻 用户 */
  EnabledUser(item) {
    if (item.isRequest) return;
    item.isRequest = true;
    this.service.EnabledUser(item.id, !item.enabled)
      .then(result => { item.enabled = !item.enabled; item.isRequest = false; })
      .catch(result => { alert(result); item.isRequest = false; });
  }

  /**重置密码 */
  ResetPassWord(item) {
    if(item.enabled==false) return;

    if (item.isRequest) return;
    item.isRequest = true;

    if (confirm("密码即将重置为手机号后6位") == false) return;

    this.service.ResetPassword(item.id)
      .then(result => { alert("重置密码成功"); item.isRequest = false; })
      .catch(result => { alert(result); item.isRequest = false; });
  }

  /**角色下拉勾选 */
  onSelectedCahngeForRoleItem(values) {
    this.userModel.roleIds = [];
    values.forEach(x => this.userModel.roleIds.push(x));
  }

  /**职位下拉勾选操作 */
  onSelectedChangeForPosition(values) {
    this.userModel.positionIds = [];
    values.forEach(x => this.userModel.positionIds.push(x));
  }

  /**查询用户 */
  protected onPageChanged(event: { page: number, itemsPerPage: number }) {
    this.params.setPage(event.page, event.itemsPerPage);
    this.getPageList();
  }
}
