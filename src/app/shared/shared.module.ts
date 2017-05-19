import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import * as services from 'app/shared/services';
import * as components from "./components";
import * as pipes from './pipes';
import * as directives from './directives';
import { FormsModule } from '@angular/forms';
import { PaginationModule, PopoverModule, AlertModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateStore } from "@ngx-translate/core/src/translate.store";
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgPipesModule } from 'ngx-pipes';
import { TreeviewModule } from "ngx-treeview";

const HQ_COMPONENTS = [
    components.PaginationComponent,
    components.ClippedWordComponent,
    components.MenuComponent,
    components.SmartTableComponent,
];

const HQ_DIRECTIVE_COMPONENTS = [
    directives.MultiSelectorComponent,
    directives.HqAlerterComponent,
    directives.TableTypeaheadComponent,
    directives.FormControlErrorComponent,
    directives.PrintComponent,
];

const HQ_DIRECTIVES = [
    directives.MultiSelectorDirective,
    directives.HqAlerter,
    directives.TableTypeaheadDirective,
    directives.PrintDirective,
    directives.FormControlErrorDirective,
    directives.SpinnerDirective,
    directives.TrimDirective,
]

const HQ_PIPES = [
    pipes.SplitPipe,
    pipes.CentToYuanPipe,
    pipes.DurationHumanizePipe,
    pipes.StandardDatePipe,
    pipes.StandardDatetimePipe,
    pipes.StandardTimePipe
];

const HQ_SERVICES = [
    services.UserService,
    services.requestOptionsProvider,
    services.HttpService,
    services.EventDispatcher,
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgPipesModule,
        RouterModule,
        PaginationModule.forRoot(),
        AlertModule.forRoot(),
        PopoverModule.forRoot(),
        Ng2SmartTableModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useClass: services.ServerTranslateLoader },
        }),
    ],
    exports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        HQ_COMPONENTS,
        HQ_PIPES,
        HQ_DIRECTIVES,
    ],
    declarations: [HQ_COMPONENTS, HQ_PIPES, HQ_DIRECTIVE_COMPONENTS, HQ_DIRECTIVES],
    entryComponents: [HQ_DIRECTIVE_COMPONENTS]
})
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [HQ_SERVICES, TranslateStore]
        }
    }
}
