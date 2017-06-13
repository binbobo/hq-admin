import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Menu, MenuService } from '../menu.service';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { SelectOption, FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { ScopeService } from '../../scope/scope.service';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css'],
})
export class MenuEditComponent extends FormHandle<Menu> {

  constructor(
    injector: Injector,
    private menuService: MenuService,
    private scopeService: ScopeService,
    private clientService: ClientService,
    private route: ActivatedRoute,
  ) {
    super(injector, menuService)
  }

  private menus: Array<SelectOption>;
  private clients: Array<SelectOption>;
  private scopes: Array<SelectOption>;

  ngOnInit() {
    super.ngOnInit();
    this.loadClients();
    this.loadScopes();
  }

  private loadClients() {
    this.clientService.getSelectOptions()
      .then(data => this.clients = data)
      .catch(err => this.alerter.error(err));
  }

  private loadScopes(): void {
    this.scopeService.getSelectOptions()
      .then(data => this.scopes = data)
      .then(data => {
        data.forEach(m => {
          let index = this.model.scopes.indexOf(m.value);
          m.checked = ~index ? true : undefined;
        });
        this.scopes = data;
      })
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
    let routerData = this.route.data.map(m => m.model);
    routerData.subscribe(menu => this.loadParentMenus(menu.clientId));
    return routerData;
  }

  protected buildForm(): FormGroup {
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
      enabled: [this.model.enabled],
      parentId: [this.model.parentId],
      autoRun: [this.model.autoRun],
      id: [this.model.id]
    });
  }
}
