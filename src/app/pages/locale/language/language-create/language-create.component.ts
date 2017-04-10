import { Component, OnInit, Injector } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LanguageService, Language } from '../language.service';
import { FormHandle } from "app/shared/models";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-language-create',
  templateUrl: './language-create.component.html',
  styleUrls: ['./language-create.component.css'],
})
export class LanguageCreateComponent extends FormHandle<Language> {

  protected getModel(): Observable<Language> {
    return Observable.of(new Language());
  }

  constructor(
    injector: Injector,
    private languageService: LanguageService,
  ) {
    super(injector, languageService);
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
      'rtl': [this.model.rtl],
    });
  }
}
