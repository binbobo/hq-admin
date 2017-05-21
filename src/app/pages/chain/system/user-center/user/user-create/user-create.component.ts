import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { User, UserService } from '../user.service';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TreeviewItem, TreeItem } from 'ngx-treeview';

@Component({
  selector: 'hq-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent extends FormHandle<User> implements OnInit {

  private roles: Array<TreeviewItem>;
  private positions: Array<TreeviewItem>;

  protected getModel(): Observable<User> {
    return Observable.of(new User());
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      password: [this.model.passWord, [Validators.required, Validators.minLength(6), Validators.maxLength(18)]],
      phone: [this.model.phone, [Validators.required, Validators.pattern('1\\d{10}')]],
      description: [this.model.description, [Validators.maxLength(100)]],
      roles: [[]],
      positions: [[]],
    });
  }

  constructor(
    injector: Injector,
    private userService: UserService,
  ) {
    super(injector, userService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.userService.getRoleOptions()
      .then(options => this.roles = this.convertToTreeView(options))
      .catch(err => this.alerter.error(err));
    this.userService.getPositionOptions()
      .then(options => this.positions = this.convertToTreeView(options))
      .catch(err => this.alerter.error(err));
  }

  onRoleSelect(event) {
    this.form.patchValue({ roles: event });
  }

  onPositionSelect(event) {
    this.form.patchValue({ positions: event });
  }

  convertToTreeView(options: Array<SelectOption>): Array<TreeviewItem> {
    if (!Array.isArray(options) || !options.length) return null;
    return options.map(m => {
      let item = new TreeviewItem({ value: m.value, text: m.text });
      item.children = this.convertToTreeView(item.children);
      return item;
    });
  }
}
