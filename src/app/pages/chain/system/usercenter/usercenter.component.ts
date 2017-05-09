import { Component, OnInit } from '@angular/core';
import {UserCenterService,UserModel,DropDownItem,UserPageparams} from "./usercenter.service"
import { FormGroup,FormBuilder } from '@angular/forms';
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
 createUserModel:FormGroup; //创建用户

 listUserModels:UserModel[]; //列表用户

 roleItem:DropDownItem; //角色列表
 position:DropDownItem; //职位列表 

 params:UserPageparams; //请求参数
 
 userModel:UserModel;

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
      UserName:"",
      Phone:"",
      Remark:""
    });

    this.params=new UserPageparams();
    this.userModel=new UserModel();

    this.roleItem=this.service.rolesDropDown;
    this.roleItem.callBack=this.onSelectedCahngeForRoleItem;
    this.position=this.service.positionsDropDown;
    this.position.callBack=this.onSelectedChangeForPosition;

    this.getPageList()
  }
  
  openEditorUser(event,userModel){
    this.userModel=userModel;
    this.isCreateOrEdit=false;
    event.show();
  }

  openCreateUser(event){
    this.userModel=new UserModel();
    this.isCreateOrEdit=true;
    event.show();
  }

  getPageList(){
    this.params.pageIndex=1;
    this.loading=true;
    this.listUserModels=null;
    this.service.getPagedList(this.params)
              .then(item=>{
                      if(item.data)
                      {
                          item.data.forEach(x=>{
                            x.userRoleName=x.roles.map(d=>d.name).join(",");
                            x.positionName=x.partPositionItems.map(d=>d.name).join(",");
                            x.partName=x.partPositionItems.map(d=>d.positionItems.map(c=>c.name)).join(",");
                          })
                          this.listUserModels=item.data;
                          this.loading = false;
                          this.list = item.data;
                          this.total = item.totalCount;
                          this.params.save();
                      }
              })
  }

  
  createOrUpdateUser(event){
    this.userModel=new UserModel();
    event.hide();
    if(this.isCreateOrEdit){
      this.service.create(null)
      .catch(item=>alert(item))
    }else{
      this.updateUser(this.userModel);
    }
  }

  updateUser(user:UserModel):void{
    this.service.update(user);
  }

    onSelectedCahngeForRoleItem(values){
      // alert(JSON.stringify(values))
    } 

    onSelectedChangeForPosition(values){
      // alert(JSON.stringify(values))
    }


    protected onPageChanged(event: { page: number, itemsPerPage: number }) {
    this.params.setPage(event.page, event.itemsPerPage);
    this.getPageList();
  }
}
