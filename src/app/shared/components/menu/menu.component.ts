import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hq-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
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
    return (this.parents.length - 1) * 8;
  }

  private getRouterLink(routes: Array<any>) {
    return routes.filter(m => m && m.trim());
  }

  private activeMenu(menus: Array<any>) {
    if (!menus || menus.length == 0) return;
    menus.forEach(m => {
      m.routes = this.parents.concat(m.path);
      if (!m.children || !Array.isArray(m.children)) return;
      let urlTree = this.router.createUrlTree(m.routes);
      m.expand = this.router.isActive(urlTree, false);
      this.activeMenu(m.children);
    });
  }
}
