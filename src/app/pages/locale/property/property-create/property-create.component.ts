import { Component, OnInit, Injector } from '@angular/core';
import { Property, PropertyService } from '../property.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Language, LanguageService } from '../../language/language.service';
import { FormHandle } from "app/shared/models";

@Component({
  selector: 'app-property-create',
  templateUrl: './property-create.component.html',
  styleUrls: ['./property-create.component.css'],
})
export class PropertyCreateComponent extends FormHandle<Property> {

  constructor(
    injector: Injector,
    protected service: PropertyService,
    private languageService: LanguageService
  ) {
    super(injector, service);
  }

  private languages: Array<Language>;

  ngOnInit() {
    super.ngOnInit();
    this.languageService.getAvailableList()
      .then(data => {
        this.languages = data;
        if (data.length) {
          this.model.languageId = data[0].id;
          this.form.patchValue(this.model);
        }
      })
      .catch(err => this.alerter.warn(err));
  }

  protected getModel(): Observable<Property> {
    return Observable.of(new Property());
  }

  protected buildForm(): FormGroup {
    return this.form = this.formBuilder.group({
      'key': [this.model.key, [
        Validators.required,
        Validators.maxLength(30)
      ]
      ],
      'value': [this.model.value, [
        Validators.required,
        Validators.maxLength(100),
      ]],
      'groupName': [this.model.value, [
        Validators.required,
        Validators.maxLength(60),
      ]],
      'entityId': [this.model.entityId, [
        Validators.required,
        Validators.minLength(36),
        Validators.maxLength(36),
        Validators.pattern('[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}')
      ]],
      'languageId': [this.model.value, [
        Validators.required,
        Validators.maxLength(36),
      ]],
    });

  }
}
