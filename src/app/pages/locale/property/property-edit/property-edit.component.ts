import { Component, OnInit, Injector } from '@angular/core';
import { Property, PropertyService } from '../property.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from "rxjs/Observable";
import { Language, LanguageService } from '../../language/language.service';
import { FormHandle } from "app/shared/models";

@Component({
  selector: 'app-property-edit',
  templateUrl: './property-edit.component.html',
  styleUrls: ['./property-edit.component.css'],
})
export class PropertyEditComponent extends FormHandle<Property> {

  constructor(
    injector: Injector,
    protected service: PropertyService,
    private route: ActivatedRoute,
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
      })
      .catch(err => this.alerter.warn(err));
  }

  protected getModel(): Observable<Property> {
    return this.route.data.map(m => m.model);
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      'key': [this.model.key, [
        Validators.required,
        Validators.maxLength(30)
      ]
      ],
      'value': [this.model.value, [
        Validators.required,
        Validators.maxLength(100),
      ]],
      'groupName': [this.model.groupName, [
        Validators.required,
        Validators.maxLength(60),
      ]],
      'entityId': [this.model.entityId, [
        Validators.required,
        Validators.minLength(36),
        Validators.maxLength(36),
        Validators.pattern('[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}')
      ]],
      'languageId': [this.model.languageId, [
        Validators.required,
        Validators.maxLength(36),
      ]],
      'enabled': [this.model.enabled],
      'id': [this.model.id]
    });
  }
}