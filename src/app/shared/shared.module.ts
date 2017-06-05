import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import * as services from 'app/shared/services';
import * as components from "./components";
import * as pipes from './pipes';
import * as directives from './directives';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, NgModel } from '@angular/forms';
import { PaginationModule, PopoverModule, AlertModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgPipesModule } from 'ngx-pipes';
import { PhoneDirective } from './directives/validators/phone.directive';
import { TelValidator } from './directives/validators/tel.directive';
import { MobileValidator } from './directives/validators/mobile.directive';
import { PlateNoValidator } from './directives/validators/plateNo.directive';
import { VINValidator } from './directives/validators/vin.directive';
import { EngineNoValidator } from './directives/validators/engineNo.directive';
import { MileageValidator } from './directives/validators/mileage.directive';
import { IDCardValidator } from './directives/validators/idCard.directive';
import { HqBsModalDirective } from './directives/modal/hq-bs-modal.directive';


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
    directives.PrintComponent,
    directives.FormGroupControlErrorComponent,
    directives.FormInlineControlErrorComponent,
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
        PaginationModule.forRoot(),
        AlertModule.forRoot(),
        PopoverModule.forRoot(),
        Ng2SmartTableModule,
        TranslateModule.forChild({
            loader: { provide: TranslateLoader, useClass: services.ServerTranslateLoader }
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
            providers: [HQ_SERVICES]
        }
    }
}
