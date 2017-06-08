import { Component, OnInit, Injector } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { Observable } from 'rxjs/Observable';
import { User, UserService } from '../user.service';
import { FormGroup, Validators } from '@angular/forms';
import { FormHandle, SelectOption } from 'app/shared/models';
import { HQ_VALIDATORS } from "app/shared/shared.module";

@Component({
  selector: 'hq-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent extends FormHandle<User> implements OnInit {

  private roles: Array<TreeviewItem>;
  private positions: Array<TreeviewItem>;
  private stations: Array<any>;

  protected getModel(): Observable<User> {
    let positions = [];
    if (Array.isArray(this.model.partPositionItems)) {
      this.model.partPositionItems
        .map(m => m.positionItems)
        .forEach(m => positions = positions.concat(m.map(m => m.id)));
    }
    this.model.positions = positions;
    if (Array.isArray(this.model.roles)) {
      this.model.roles = this.model.roles.map(m => m['id']);
    } else {
      this.model.roles = [];
    }
    return Observable.of(this.model);
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.model.id],
      name: [this.model.name, [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
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
      .then(options => this.roles = this.convertToTreeView(options, this.model.roles))
      .catch(err => this.alerter.error(err));
    this.userService.getStations()
      .then(data => this.stations = data)
      .catch(err => this.alerter.error(err));
    this.loadPostions(this.model.orgId);
  }

  loadPostions(orgId?: string) {
    this.userService.getPositionOptions(orgId)
      .then(options => this.positions = this.convertToTreeView(options, this.model.positions))
      .catch(err => this.alerter.error(err));
  }

  onStationChange(event: Event) {
    this.form.patchValue({ positions: [] });
    let element = event.target as HTMLSelectElement;
    this.loadPostions(element.value);
  }

  onRoleSelect(event) {
    this.form.patchValue({ roles: event });
  }

  onPositionSelect(event) {
    this.form.patchValue({ positions: event });
  }

  convertToTreeView(options: Array<SelectOption>, checkedList: Array<string>): Array<TreeviewItem> {
    if (!Array.isArray(options) || !options.length) return null;
    return options.map(m => {
      let item = new TreeviewItem({ value: m.value, text: m.text });
      item.checked = checkedList && checkedList.includes(item.value);
      item.children = this.convertToTreeView(m['children'], checkedList);
      return item;
    });
  }
}
