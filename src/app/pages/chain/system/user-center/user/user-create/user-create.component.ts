import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { User, UserService } from '../user.service';
import { FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { TreeviewItem, TreeItem } from 'ngx-treeview';
import { HQ_VALIDATORS } from "app/shared/shared.module";

@Component({
  selector: 'hq-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent extends FormHandle<User> implements OnInit {

  private roles: Array<TreeviewItem>;
  private positions: Array<TreeviewItem>;
  private stations: Array<any>;

  protected getModel(): Observable<User> {
    return Observable.of(new User());
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      password: [this.model.passWord, [Validators.required, Validators.minLength(6), Validators.maxLength(18)]],
      phone: [this.model.phone, [Validators.required, HQ_VALIDATORS.mobile]],
      description: [this.model.description, [Validators.maxLength(100)]],
      orgId: [this.model.orgId, [Validators.required]],
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
    this.userService.getStations()
      .then(data => this.stations = data)
      .then(data => data && data.length && data[0].value)
      .then(orgId => {
        if (orgId) {
          this.form.get('orgId').setValue(orgId);
        }
        this.loadPostions(orgId);
      })
      .catch(err => this.alerter.error(err));
  }

  loadPostions(orgId?: string) {
    this.userService.getPositionOptions(orgId)
      .then(options => this.positions = this.convertToTreeView(options))
      .catch(err => this.alerter.error(err));
  }

  onRoleSelect(event) {
    this.form.patchValue({ roles: event });
  }

  onPositionSelect(event) {
    this.form.patchValue({ positions: event });
  }

  onStationChange(event: Event) {
    this.form.patchValue({ positions: [] });
    let element = event.target as HTMLSelectElement;
    this.loadPostions(element.value);
  }

  convertToTreeView(options: Array<SelectOption>): Array<TreeviewItem> {
    if (!Array.isArray(options) || !options.length) return null;
    return options.map(m => {
      let item = new TreeviewItem({ value: m.value, text: m.text, checked: false });
      item.children = this.convertToTreeView(m['children']);
      return item;
    });
  }
}
