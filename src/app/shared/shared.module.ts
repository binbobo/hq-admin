import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import * as services from 'app/shared/services';
import * as components from "./components";
import * as pipes from './pipes';
import * as directives from './directives';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, NgModel } from '@angular/forms';
import { PaginationModule, PopoverModule, AlertModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { TextMaskModule } from 'angular2-text-mask';


const HQ_COMPONENTS = [
    components.PaginationComponent,
    components.ClippedWordComponent,
    components.MenuComponent,
    components.SmartTableComponent,
    components.TreeComponent,
    components.DropdownTreeComponent
];

const HQ_DIRECTIVE_COMPONENTS = [
    directives.MultiSelectorComponent,
    directives.HqAlerterComponent,
    directives.TableTypeaheadComponent,
    directives.PrintComponent,
    directives.FormGroupControlErrorComponent,
    directives.FormInlineControlErrorComponent,
    directives.HqModalComponent,
];

const HQ_DIRECTIVES = [
    directives.MultiSelectorDirective,
    directives.HqAlerter,
    directives.TableTypeaheadDirective,
    directives.PrintDirective,
    directives.FormGroupControlErrorDirective,
    directives.FormInlineControlErrorDirective,
    directives.SpinnerDirective,
    directives.NgModelTrimDirective,
    directives.FormControlTrimDirective,
    directives.FormControlNameTrimDirective,
    directives.MobileValidator,
    directives.TelValidator,
    directives.PlateNoValidator,
    directives.VINValidator,
    directives.EngineNoValidator,
    directives.MileageValidator,
    directives.IDCardValidator,
    directives.HqBsModalDirective,
    directives.HqModalDirective,
    directives.ConversionCaseDirective,
    directives.HeaderFixedDirective,
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
    services.RequestIdService,
    services.requestOptionsProvider,
    services.HttpService,
    services.EventDispatcher,
    services.treeviewI18nProvider,
]

export const HQ_VALIDATORS = {
    mobile: directives.MobileValidator.validator,
    tel: directives.TelValidator.validator,
    plateNo: directives.PlateNoValidator.validator,
    vin: directives.VINValidator.validator,
    engineNo: directives.EngineNoValidator.validator,
    mileage: directives.MileageValidator.validator,
    idCard: directives.IDCardValidator.validator,
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgPipesModule,
        RouterModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        AlertModule.forRoot(),
        PopoverModule.forRoot(),
        Ng2SmartTableModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useClass: services.ServerTranslateLoader }
        }),
        TextMaskModule
    ],
    exports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        TextMaskModule,
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
            providers: [HQ_SERVICES]
        }
    }
}
