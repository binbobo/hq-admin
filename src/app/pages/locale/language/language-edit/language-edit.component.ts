import { Component, OnInit, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, Validators } from '@angular/forms';
import { LanguageService, Language } from '../language.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormHandle } from "app/shared/models";

@Component({
  selector: 'app-language-edit',
  templateUrl: './language-edit.component.html',
  styleUrls: ['./language-edit.component.css'],
})
export class LanguageEditComponent extends FormHandle<Language> {

  constructor(
    injector: Injector,
    private languageService: LanguageService,
    private route: ActivatedRoute,
  ) {
    super(injector, languageService);
  }

  protected getModel(): Observable<Language> {
    return this.route.data.map(m => m.model);
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      'name': [this.model.name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]
      ],
      'flag': [this.model.flag, [
        Validators.required,
        Validators.maxLength(20)
      ]],
      'code': [this.model.code, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(2),
      ]],
      'culture': [this.model.culture, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10)
      ]],
      'displayOrder': [this.model.displayOrder],
      'enabled': [this.model.enabled],
      'rtl': [this.model.rtl],
      'id': [this.model.id]
    });
  }
}
