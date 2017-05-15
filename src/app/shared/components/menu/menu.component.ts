import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hq-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {

  @Input("menus")
  private menus: Array<any>;
  @Input()
  private root: boolean = false;
  @Input()
  private parents: Array<string> = ["/"];

  constructor(private router: Router) { }

  ngOnInit() {
    this.activeMenu(this.menus);
  }

  private get spaceWidth(): number {
    return (this.parents.length - 1) * 9;
  }

  private getRouterLink(routes: Array<any>) {
    return routes.filter(m => m && m.trim());
  }

  private toggle(item) {
    this.menus.filter(m => m != item).forEach(m => m.expand = false);
    item.expand = !item.expand;
  }

  private activeMenu(menus: Array<any>) {
    if (!menus || menus.length == 0) return;
    menus.forEach(m => {
      m.routes = this.parents.concat(m.path);
      if (!m.children || !Array.isArray(m.children)) return;
      m.expand = this.activable(m);
      this.activeMenu(m.children);
    });
  }

  private activable(menu: any): boolean {
    let isActive = false;
    if (!menu.path && menu.children && menu.children.length) {
      for (var index = 0; index < menu.children.length; index++) {
        var element = menu.children[index];
        let arr = menu.routes.slice(0);
        arr.push(element.path);
        element.routes = arr;
        isActive = this.activable(element);
        if (isActive) break;
      }
    } else {
      let urlTree = this.router.createUrlTree(this.getRouterLink(menu.routes));
      isActive = this.router.isActive(urlTree, false);
    }
    return isActive;
  }
}
