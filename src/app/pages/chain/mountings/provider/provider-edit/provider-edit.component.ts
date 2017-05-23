import { Component, OnInit, Injector, Input, Output } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { ProviderService, Provider } from '../provider.service';
import { FormGroup, Validators } from '@angular/forms';
import { HQ_VALIDATORS } from 'app/shared/shared.module';

@Component({
  selector: 'hq-provider-edit',
  templateUrl: './provider-edit.component.html',
  styleUrls: ['./provider-edit.component.css']
})
export class ProviderEditComponent extends FormHandle<Provider> implements OnInit {

  constructor(
    injector: Injector,
    service: ProviderService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Provider> {
    return Observable.of(this.model);
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.model.id],
      code: [this.model.code, [Validators.maxLength(50)]],
      name: [this.model.name, [Validators.required, Validators.maxLength(100),]],
      shortName: [this.model.shortName, [Validators.maxLength(30),]],
      contactUser: [this.model.contactUser, [Validators.required, Validators.maxLength(20),]],
      tel: [this.model.tel, [Validators.required, HQ_VALIDATORS.mobile,]],
      address: [this.model.address, [Validators.maxLength(40),]],
      postal: [this.model.postal, [Validators.maxLength(10),]],
      fax: [this.model.fax, [HQ_VALIDATORS.tel, Validators.maxLength(20)]],
      description: [this.model.description, [Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
