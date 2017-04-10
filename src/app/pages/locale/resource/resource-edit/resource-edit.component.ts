import { Component, OnInit, Injector } from '@angular/core';
import { SelectOption, FormHandle } from 'app/shared/models';
import { Resource, ResourceService } from '../resource.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Location } from '@angular/common';
import { LanguageService, Language } from '../../language/language.service';
import { GroupService } from '../../group/group.service';

@Component({
  selector: 'app-resource-edit',
  templateUrl: './resource-edit.component.html',
  styleUrls: ['./resource-edit.component.css'],
})
export class ResourceEditComponent extends FormHandle<Resource> implements OnInit {

  constructor(
    injector: Injector,
    protected service: ResourceService,
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private groupService: GroupService,
  ) {
    super(injector, service);
  }

  private languages: Array<Language>;
  private groups: Array<SelectOption>;

  ngOnInit() {
    super.ngOnInit();
    this.groupService.getOptionList()
      .then(data => {
        data.forEach(m => {
          let index = this.model.groups.indexOf(m.value);
          m.selected = ~index ? true : undefined;
        });
        this.groups = data;
      })
      .catch(err => this.alerter.error(err));
    this.languageService.getAvailableList()
      .then(data => this.languages = data)
      .catch(err => this.alerter.error(err));
  }

  private onSelectGroup(event: Event) {
    let el = event.target as HTMLInputElement;
    let groups = this.form.get('groups').value as Array<string>;
    let index = groups.indexOf(el.value);
    if (el.checked) {
      ~index || groups.push(el.value);
    } else {
      ~index && groups.splice(index, 1);
    }
  }

  protected getModel(): Observable<Resource> {
    return this.route.data.map(m => m.model);
  }

  protected buidForm(): FormGroup {
    return this.form = this.formBuilder.group({
      key: [this.model.key, [
        Validators.required,
        Validators.maxLength(30)
      ]],
      value: [this.model.value, [
        Validators.required,
        Validators.maxLength(100),
      ]],
      languageId: [this.model.languageId, [
        Validators.required,
        Validators.maxLength(36),
      ]],
      groups: this.formBuilder.array(this.model.groups),
      enabled: [this.model.enabled],
      id: [this.model.id]
    });
  }
}