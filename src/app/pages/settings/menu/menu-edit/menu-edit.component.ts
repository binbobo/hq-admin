import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Menu, MenuService } from '../menu.service';
import { Location } from '@angular/common';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { SelectOption, FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css'],
})
export class MenuEditComponent extends FormHandle<Menu> {

  constructor(
    injector: Injector,
    private menuService: MenuService,
    private route: ActivatedRoute,
  ) {
    super(injector, menuService)
  }

  private menus: Array<SelectOption>;

  ngOnInit() {
    super.ngOnInit();
    this.menuService.getSelectOptions()
      .then(data => this.menus = data)
      .catch(err => this.alerter.error(err));
  }

  protected getModel(): Observable<Menu> {
    return this.route.data.map(m => m.model);
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
      'enabled': [this.model.enabled],
      'parentId': [this.model.parentId],
      'id': [this.model.id]
    });
  }
}
