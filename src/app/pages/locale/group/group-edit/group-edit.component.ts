import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from "rxjs/Observable";
import { Group, GroupService } from '../group.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css'],
})
export class GroupEditComponent extends FormHandle<Group> {

  constructor(
    injector: Injector,
    protected service: GroupService,
    private route: ActivatedRoute,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Group> {
    return this.route.data.map(m => m.model);
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      'groupName': [this.model.groupName, [
        Validators.required,
        Validators.maxLength(30)
      ]],
      'displayOrder': [this.model.displayOrder, [
        Validators.required,
      ]],
      'description': [this.model.description, [
        Validators.required,
        Validators.maxLength(100),
      ]],
      'enabled': [this.model.enabled],
      'id': [this.model.id]
    });
  }

}