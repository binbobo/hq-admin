import { Component, OnInit, Injector } from '@angular/core';
import { Language, LanguageService, LanguageListRequest } from '../language.service';
import { DataList } from "app/shared/models";

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.css'],
})
export class LanguageListComponent extends DataList<Language> {

  constructor(
    injector: Injector,
    protected service: LanguageService,
  ) {
    super(injector, service);
    this.params = new LanguageListRequest();
  }

}
