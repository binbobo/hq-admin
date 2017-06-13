import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { Client, ClientService } from '../client.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../application/application.service';
import { element } from 'protractor';

@Component({
  selector: 'app-client-create',
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class ClientCreateComponent extends FormHandle<Client> implements OnInit {

  private applications: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: ClientService,
    private appService: ApplicationService
  ) { super(injector, service); }

  ngOnInit() {
    super.ngOnInit();
    this.loadApplications()
      .then(data => data && data.length ? data[0] : Promise.reject(''))
      .then(app => {
        this.model.applicationId = app.value;
        this.form.patchValue(this.model);
      })
  }

  private loadApplications(): Promise<Array<SelectOption>> {
    return this.appService.getSelectOptions()
      .then(data => this.applications = data)
      .catch(err => this.alerter.error(err));
  }

  protected getModel(): Observable<Client> {
    return Observable.of(new Client());
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [
        Validators.required,
        Validators.maxLength(30)
      ]],
      key: [this.model.key, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      logo: [this.model.logo],
      applicationId: [this.model.applicationId, [Validators.required]],
      description: [this.model.description, [Validators.maxLength(200)]],
      displayOrder: [this.model.displayOrder],
    });
  }

}
