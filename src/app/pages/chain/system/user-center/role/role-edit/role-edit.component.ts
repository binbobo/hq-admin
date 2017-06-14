import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { Role, RoleService } from '../role.service';

@Component({
  selector: 'hq-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css']
})
export class RoleEditComponent extends FormHandle<Role> implements OnInit {

  constructor(
    injector: Injector,
    service: RoleService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Role> {
    return Observable.of(this.model);
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.model.id],
      name: [this.model.name, [Validators.required, Validators.maxLength(30),]],
      description: [this.model.description, [Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

}