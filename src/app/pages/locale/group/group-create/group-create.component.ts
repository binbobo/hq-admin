import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Group, GroupService } from '../group.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css'],
})
export class GroupCreateComponent extends FormHandle<Group> {

  constructor(
    injector: Injector,
    protected service: GroupService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Group> {
    return Observable.of(new Group());
  }

  protected buildForm(): FormGroup {
    return this.form = this.formBuilder.group({
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
      ]]
    });

  }
}