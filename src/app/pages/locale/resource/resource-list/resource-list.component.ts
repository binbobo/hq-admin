import { Component, OnInit, Injector } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { Resource, ResourceService, ResourceListRequest } from '../resource.service';
import { LanguageService, Language } from '../../language/language.service';
import { GroupService } from '../../group/group.service';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css'],
})
export class ResourceListComponent extends DataList<Resource> implements OnInit {

  private languages: Array<Language>;
  private groups: Array<SelectOption>;

  constructor(
    injector: Injector,
    protected service: ResourceService,
    private languageService: LanguageService,
    private groupService: GroupService,
  ) {
    super(injector, service);
    this.params = new ResourceListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
    this.languageService.getAvailableList()
      .then(data => this.languages = data)
      .catch(err => this.alerter.warn(err));
    this.groupService.getOptionList()
      .then(data => this.groups = data)
      .catch(err => this.alerter.error(err));
  }

}
