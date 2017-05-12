import { Component, OnInit } from '@angular/core';
import {UserCenterService,UserModel,DropDownItem,UserPageparams} from "./usercenter.service"
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import {TreeviewItem,TreeviewConfig} from "ngx-treeview"

@Component({
  selector: 'hq-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.css']
})
export class UsercenterComponent implements OnInit {

  constructor(
    protected service:UserCenterService,
    private builder:FormBuilder
  ) { }

 userSearch:FormGroup; //搜索条件
 /**
  * 表单 创建用户模型
  */
 createUserModel:FormGroup;

 listUserModels:UserModel[]; //列表用户
/**
 * 角色下拉列表数据
 */
 roleItem:DropDownItem=new DropDownItem([],this.onSelectedCahngeForRoleItem); 
 /**
  * 职位下拉列表数据
  */
 position:DropDownItem=new DropDownItem([],this.onSelectedChangeForPosition); 

 params:UserPageparams; //请求参数
 
 /**
  * 创建 和 编辑 使用的用户模型
  */
 userModel:UserModel=new UserModel();

 isCreateOrEdit:boolean;

  protected total: number = 0;
  protected index: number = 1;
  protected size: number = 10;
  protected loading: boolean;
  protected list: Array<UserModel>;

  ngOnInit() {
    this.isCreateOrEdit=true;
   this.userSearch=this.builder.group({
      keyword:""
    });
    
    this.createUserModel=this.builder.group({
      UserName:["",[Validators.required]],
      Phone:["",[Validators.required,Validators.pattern("^1[3|4|5|7|8][0-9]{9}$")]],
      Remark:""
    });

    this.params=new UserPageparams();
    // this.userModel=new UserModel();

    this.service.getRolesOptions().then(item=>{
      this.roleItem.items=item;
    });
    this.service.getPositionOptions().then(item=>{
      this.position.items=item;
    });
    
    // this.position=this.service.getPositionsDropDown;
    // this.position.callBack=this.onSelectedChangeForPosition;
    // this.roleItem=this.service.rolesDropDown;
    // this.roleItem.callBack=this.onSelectedCahngeForRoleItem;
    this.getPageList()
  }
  
  openEditorUser(event,userModel:UserModel){
    // this.userModel=userModel;

    this.userModel.ClearData();
    this.userModel.name=userModel.name;
    this.userModel.phone=userModel.phone;
    this.userModel.description=userModel.description;
    this.userModel.positionIds=userModel.positionIds;
    this.userModel.roleIds=userModel.roleIds;

    alert(JSON.stringify(this.userModel.positionIds))
     alert(JSON.stringify(this.userModel.roleIds))
    this.service.SelectedTreeNode(this.position.items,this.userModel.positionIds);
    this.service.SelectedTreeNode(this.position.items,this.userModel.roleIds);

    this.isCreateOrEdit=false;
    event.show();
  }

/**
 *
 */
  openCreateUser(event){
    this.userModel.ClearData();
    this.isCreateOrEdit=true;
    // this.service.getPositionOptions();
    this.position.items.forEach(x=>{x.setCheckedRecursive(false);x.setCollapsedRecursive(false);});
    this.roleItem.items.forEach(x=>{x.setCheckedRecursive(false);x.setCollapsedRecursive(false);});
    event.show();
  }

  getPageList(){
    if(this.loading) return;
    this.params.pageIndex=1;
    this.loading=true;
    this.listUserModels=null;
    this.service.getPagedList(this.params)
              .then(item=>{
                this.loading = false;
                      if(item.data)
                      {
                          item.data.forEach(x=>{
                            x.userRoleName=x.roles.map(d=>d.name).join(",");
                            x.roleIds=x.roles.map(d=>d.id);
                            if(x.partPositionItems) {
                              x.positionName=x.partPositionItems.map(d=>d.name).join(",");
                              x.partName=x.partPositionItems.map(d=>d.positionItems.map(c=>c.name)).join(",");
                              x.positionIds=x.partPositionItems.map(d=>d.positionItems.map(e=>e.id).join())
                            }
                          })
                          this.listUserModels=item.data;
                          this.list = item.data;
                          this.total = item.totalCount;
                          this.params.save();
                      }
                     
              }).catch(x=>{
                this.loading = false;
              })
  }

  
  createOrUpdateUser(event){
    // if(this.createUserModel.invalid==false) return;
    // alert(this.createUserModel.invalid)

    // event.hide();
    
    let userInfoModel={
            Name:this.userModel.name,
            Phone:this.userModel.phone,
            Description:this.userModel.description,
            Roles:this.userModel.roleIds,
            Positions:this.userModel.positionIds
          }
          
    if(this.isCreateOrEdit){
      this.service.create(userInfoModel)
      .catch(item=>alert(item))

    }else{
      this.updateUser(this.userModel);
    }
  }

  updateUser(user:UserModel):void{
    this.service.update(user);
  }
  
  EnabledUser(item){
    if(item.isRequest) return;
    item.isRequest=true;
    this.service.EnabledUser(item.id,!item.enabled)
      .then(result=>{item.enabled=!item.enabled;item.isRequest=false;})
      .catch(result=>{alert(result);item.isRequest=false;});
  }

  ResetPassWord(item){
    if(item.isRequest) return;
     item.isRequest=true;

    if(confirm("密码即将重置为手机号后6位")==false) return;

    this.service.ResetPassword(item.id)
      .then(result=>{alert("重置密码成功");item.isRequest=false;})
      .catch(result=>{alert(result);item.isRequest=false;});
  }

    onSelectedCahngeForRoleItem(values){
       this.userModel.roleIds.push(values);
    } 

    onSelectedChangeForPosition(values){
      this.userModel.positionIds.push(values);
    }


    protected onPageChanged(event: { page: number, itemsPerPage: number }) {
    this.params.setPage(event.page, event.itemsPerPage);
    this.getPageList();
  }
}
