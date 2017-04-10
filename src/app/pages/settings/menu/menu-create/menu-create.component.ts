import { Component, OnInit, Injector } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MenuService, Menu } from '../menu.service';
import { SelectOption, FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-menu-create',
  templateUrl: './menu-create.component.html',
  styleUrls: ['./menu-create.component.css'],
})
export class MenuCreateComponent extends FormHandle<Menu> implements OnInit {

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
    this.route.queryParams.subscribe((params: Params) => {
      if (params['parentId']) {
        this.model.parentId = params['parentId'];
        this.form.patchValue(this.model);
      }
    });
    this.menuService.getSelectOptions()
      .then(data => this.menus = data)
      .catch(err => this.alerter.error(err));
  }

  protected getModel(): Observable<Menu> {
    return Observable.of(new Menu());
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
