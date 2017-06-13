import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Application, ApplicationService } from '../application.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-app-edit',
  templateUrl: './app-edit.component.html',
  styleUrls: ['./app-edit.component.css']
})
export class AppEditComponent extends FormHandle<Application>{

  constructor(
    injector: Injector,
    service: ApplicationService,
    private route: ActivatedRoute,
  ) { super(injector, service); }

  protected getModel(): Observable<Application> {
    return this.route.data.map(m => m.model);
  }

  protected buildForm(): FormGroup {
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
      enabled: [this.model.enabled],
      id: [this.model.id]
    })
  }
}
