import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Provider, ProviderService } from '../provider.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';

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

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      code: [this.model.id, [
        Validators.maxLength(100)
      ]]
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
