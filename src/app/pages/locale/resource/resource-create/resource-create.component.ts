import { Component, OnInit, Injector } from '@angular/core';
import { Resource, ResourceService } from '../resource.service';
import { SelectOption, FormHandle } from 'app/shared/models';
import { FormGroup, Validators, FormArray } from '@angular/forms';
import { LanguageService, Language } from '../../language/language.service';
import { Observable } from 'rxjs/Observable';
import { GroupService } from '../../group/group.service';

@Component({
  selector: 'app-resource-create',
  templateUrl: './resource-create.component.html',
  styleUrls: ['./resource-create.component.css'],
})
export class ResourceCreateComponent extends FormHandle<Resource> implements OnInit {

  constructor(
    injector: Injector,
    protected service: ResourceService,
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
      .then(data => this.groups = data)
      .catch(err => this.alerter.error(err));
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

  protected getModel(): Observable<Resource> {
    return Observable.of(new Resource());
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

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
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
      groups: this.formBuilder.array(this.model.groups)
    });
  }
}