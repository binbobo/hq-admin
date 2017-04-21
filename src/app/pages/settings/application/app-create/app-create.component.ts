import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Application, ApplicationService } from '../application.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-app-create',
  templateUrl: './app-create.component.html',
  styleUrls: ['./app-create.component.css']
})
export class AppCreateComponent extends FormHandle<Application> {

  constructor(
    injector: Injector,
    service: ApplicationService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Application> {
    return Observable.of(new Application());
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [
        Validators.required,
        Validators.maxLength(30)
      ]],
      logo: [this.model.logo, [
        Validators.minLength(2),
        Validators.maxLength(50),
      ]],
      displayOrder: [this.model.displayOrder],
    })
  }

}
