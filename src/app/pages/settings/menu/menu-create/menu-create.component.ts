import { Component, OnInit, Injector } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MenuService, Menu } from '../menu.service';
import { SelectOption, FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';
import { ScopeService } from '../../scope/scope.service';
import { ClientService } from '../../client/client.service';

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
    private clientService: ClientService,
    private route: ActivatedRoute,
  ) {
    super(injector, menuService);
  }

  private menus: Array<SelectOption>;
  private clients: Array<SelectOption>;
  private scopes: Array<SelectOption>;

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams.subscribe((params: Params) => {
      if (params['parentId']) {
        this.model.parentId = params['parentId'];
        this.form.patchValue(this.model);
      }
    });
    this.loadClients();
    this.loadScopes();
  }

  private loadClients() {
    this.clientService.getSelectOptions()
      .then(data => this.clients = data)
      .then(data => {
        if (data && data.length) {
          this.model.clientId = data[0].value;
          this.form.patchValue(this.model);
          this.loadParentMenus(data[0].value);
        }
      })
      .catch(err => this.alerter.error(err));
  }

  private loadScopes(): void {
    this.scopeService.getSelectOptions()
      .then(data => this.scopes = data)
      .catch(err => this.alerter.error(err));
  }

  private loadParentMenus(clientId?: string): void {
    var cid = clientId || this.model.clientId;
    this.menuService.getSelectOptions(cid)
      .then(data => this.menus = data)
      .catch(err => this.alerter.error(err));
  }

  private onClientChange(event: Event) {
    let ele = event.target as HTMLInputElement;
    this.loadParentMenus(ele.value);
  }

  private onScopeSelect(event: Event) {
    let ele = event.target as HTMLInputElement;
    let index = this.model.scopes.indexOf(ele.value);
    let scopes = this.form.get('scopes').value as Array<string>;
    if (ele.checked && !~index) {
      scopes.push(ele.value);
    } else if (!ele.checked && ~index) {
      scopes.splice(index, 1);
    }
  }

  protected getModel(): Observable<Menu> {
    return Observable.of(new Menu());
  }

  protected onCreate() {
    let submit = super.onCreate();
    if (submit === false) {
      return false;
    }
    return submit.then(() => this.loadParentMenus());
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.model.title, [
        Validators.required,
        Validators.maxLength(20)
      ]],
      path: [this.model.path, [
        Validators.maxLength(20),
      ]],
      icon: [this.model.icon, [
        Validators.minLength(2),
        Validators.maxLength(30),
      ]],
      scopes: this.formBuilder.array(this.model.scopes),
      clientId: [this.model.clientId, [Validators.required]],
      displayOrder: [this.model.displayOrder],
      autoRun: [this.model.autoRun],
      parentId: [this.model.parentId],
    });
  }
}
