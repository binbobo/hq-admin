import { Component, OnInit, Injector } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { Property, PropertyService, PropertyListRequest } from '../property.service';
import { AlerterService } from 'app/shared/services';
import { LanguageService, Language } from '../../language/language.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
  providers: [AlerterService]
})
export class PropertyListComponent extends DataList<Property> implements OnInit {

  private languages: Array<Language>;

  constructor(
    injector: Injector,
    protected service: PropertyService,
    private languageService: LanguageService
  ) {
    super(injector, service);
    this.params = new PropertyListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
    this.languageService.getAvailableList()
      .then(data => this.languages = data)
      .catch(err => this.alerter.warn(err));
  }
}
