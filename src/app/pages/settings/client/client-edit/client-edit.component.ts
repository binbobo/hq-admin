import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { Client, ClientService } from '../client.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../application/application.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent extends FormHandle<Client> {

  private applications: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: ClientService,
    private route: ActivatedRoute,
    private appService: ApplicationService
  ) { super(injector, service); }

  ngOnInit() {
    super.ngOnInit();
    this.loadApplications();
  }

  private loadApplications(): Promise<Array<SelectOption>> {
    return this.appService.getSelectOptions()
      .then(data => this.applications = data)
      .catch(err => this.alerter.error(err));
  }

  protected getModel(): Observable<Client> {
    return this.route.data.map(m => m.model);
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [
        Validators.required,
        Validators.maxLength(30)
      ]],
      key: [this.model.key, [
        Validators.required,
        Validators.maxLength(32)
      ]],
      logo: [this.model.logo],
      applicationId: [this.model.applicationId, [Validators.required]],
      description: [this.model.description, [Validators.maxLength(200)]],
      displayOrder: [this.model.displayOrder],
      enabled: [this.model.enabled],
      id: [this.model.id]
    });
  }

}
