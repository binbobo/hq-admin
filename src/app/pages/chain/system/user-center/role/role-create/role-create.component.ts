import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { Role, RoleService } from '../role.service';

@Component({
  selector: 'hq-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css']
})
export class RoleCreateComponent extends FormHandle<Role> implements OnInit {

  constructor(
    injector: Injector,
    service: RoleService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Role> {
    return Observable.of(new Role());
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [Validators.required, Validators.maxLength(30),]],
      description: [this.model.description, [Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }
}