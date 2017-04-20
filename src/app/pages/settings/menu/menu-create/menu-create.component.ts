import { Component, OnInit, Injector } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MenuService, Menu } from '../menu.service';
import { SelectOption, FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { ScopeService } from '../../scope/scope.service';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css'],
})
export class MenuCreateComponent extends FormHandle<Menu> implements OnInit {

  constructor(
    injector: Injector,
    private menuService: MenuService,
    private scopeService: ScopeService,
    private route: ActivatedRoute,
  ) {
    super(injector, menuService);
  }

  private menus: Array<SelectOption>;

  private scopes: Array<SelectOption>;

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams.subscribe((params: Params) => {
      if (params['parentId']) {
        this.model.parentId = params['parentId'];
        this.form.patchValue(this.model);
      }
    });
    this.loadParentMenus();
    this.loadScopes();
  }

  private loadScopes(): void {
    this.scopeService.getOptions()
      .then(data => this.scopes = data)
      .catch(err => this.alerter.error(err));
  }

  private loadParentMenus(): void {
    this.menuService.getSelectOptions()
      .then(data => this.menus = data)
      .catch(err => this.alerter.error(err));
  }

  private onSelectScope(event: Event) {
    let ele = event.target as HTMLInputElement;
    let index = this.model.scopes.indexOf(ele.value);
    if (ele.checked && !~index) {
      this.model.scopes.push(ele.value);
    } else if (!ele.checked && ~index) {
      this.model.scopes.splice(index, 1);
    }
  }

  protected getModel(): Observable<Menu> {
    return Observable.of(new Menu());
  }

  protected onCreate() {
    return super.onCreate().then(() => this.loadParentMenus());
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      'title': [this.model.title, [
        Validators.required,
        Validators.maxLength(20)
      ]
      ],
      'path': [this.model.path, [
        Validators.maxLength(20),
      ]],
      'icon': [this.model.icon, [
        Validators.minLength(2),
        Validators.maxLength(30),
      ]],
      'displayOrder': [this.model.displayOrder],
      'parentId': [this.model.parentId],
    });
  }
}
