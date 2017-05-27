import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList } from 'app/shared/models';
import { User, UserService, UserSearchParams } from '../user.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'hq-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent extends DataList<User> implements OnInit {

  private user: User;

  @ViewChild('createModal')
  private createModal: ModalDirective;

  @ViewChild('editModal')
  private editModal: ModalDirective;

  constructor(
    injector: Injector,
    private userService: UserService
  ) {
    super(injector, userService);
    this.params = new UserSearchParams();
  }

  onResetPassword(event: Event, user: User) {
    if (!confirm('密码即将重置为手机号后6位，是否确认操作?')) {
      return false;
    }
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    this.userService.resetPassword(user.id)
      .then(() => btn.disabled = false)
      .then(() => this.alerter.success('密码重置成功！'))
      .catch(err => {
        this.alerter.error(err);
        btn.disabled = false;
      });
  }

  onToggle(event: Event, user: User, enabled: boolean) {
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    this.userService.enable(user.id, enabled)
      .then(() => btn.disabled = false)
      .then(() => this.alerter.success('用户状态修改成功！'))
      .then(() => this.loadList())
      .catch(err => {
        this.alerter.error(err);
        btn.disabled = false;
      });
  }

  onUserUpdate(event: Event, user: User) {
    this.user = Object.assign({}, user);
    this.editModal.show();
  }

  onUserCreated() {
    this.alerter.success('新增用户成功！');
    this.createModal.hide();
    this.loadList();
  }

  onUserUpdated() {
    this.user = undefined;
    this.alerter.success('编辑用户信息成功！');
    this.editModal.hide();
    this.loadList();
  }

}
