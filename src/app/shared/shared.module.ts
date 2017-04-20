import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ServerTranslateLoader, HttpService, requestOptionsProvider, UserService, EventDispatcher } from 'app/shared/services';
import { AlerterComponent, PaginationComponent, ControlErrorComponent, ControlErrorsComponent, MenuComponent, LoadingComponent, ClippedWordComponent, SmartTableComponent } from "./components";
import { HtmlPipe } from './pipes';
import { FormsModule } from '@angular/forms';
import { PaginationModule, PopoverModule, AlertModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { TranslateStore } from "@ngx-translate/core/src/translate.store";
import { MultiSelectorDirective, MultiSelectorComponent } from 'app/shared/directives';
import { Ng2SmartTableModule } from 'ng2-smart-table';


const HQ_COMPONENTS = [
    AlerterComponent,
    PaginationComponent,
    ControlErrorComponent,
    ControlErrorsComponent,
    ClippedWordComponent,
    MenuComponent,
    LoadingComponent,
    MultiSelectorComponent,
    SmartTableComponent,
    MultiSelectorDirective,
];

const HQ_PIPES = [
    HtmlPipe
];

const HQ_SERVICES = [
    UserService,
    requestOptionsProvider,
    HttpService,
    EventDispatcher,
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PaginationModule.forRoot(),
        AlertModule.forRoot(),
        PopoverModule.forRoot(),
        Ng2SmartTableModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useClass: ServerTranslateLoader },
        }),
    ],
    exports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        HQ_COMPONENTS,
        HQ_PIPES,
    ],
    declarations: [HQ_COMPONENTS, HQ_PIPES, MultiSelectorDirective, SmartTableComponent],
    entryComponents: [MultiSelectorComponent]
})
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [HQ_SERVICES, TranslateStore]
        }
    }
}
