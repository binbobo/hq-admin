import {NgModule} from "@angular/core"
import {Routes,RouterModule} from "@angular/router"
import {UsercenterComponent} from "./usercenter/usercenter.component"
const routes:Routes=[
    {path:"usercenter",component:UsercenterComponent}
];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class SystemRouting{}

export const routedComponents=[UsercenterComponent]; 