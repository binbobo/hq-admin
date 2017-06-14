import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Provider, ProviderService } from '../provider.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { HQ_VALIDATORS } from 'app/shared/shared.module';

@Component({
  selector: 'hq-provider-create',
  templateUrl: './provider-create.component.html',
  styleUrls: ['./provider-create.component.css']
})
export class ProviderCreateComponent extends FormHandle<Provider> implements OnInit {

  constructor(
    injector: Injector,
    service: ProviderService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Provider> {
    return Observable.of(new Provider());
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.model.name, [Validators.required, Validators.maxLength(100),]],
      shortName: [this.model.shortName, [Validators.maxLength(30),]],
      contactUser: [this.model.contactUser, [Validators.required, Validators.maxLength(20),]],
      tel: [this.model.tel, [HQ_VALIDATORS.mobile, Validators.maxLength(11),]],
      address: [this.model.address, [Validators.maxLength(40),]],
      postal: [this.model.postal, [Validators.maxLength(10),]],
      fax: [this.model.fax, [Validators.maxLength(20), HQ_VALIDATORS.tel]],
      description: [this.model.description, [Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
