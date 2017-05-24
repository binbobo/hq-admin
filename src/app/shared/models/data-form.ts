import { OnInit, Injector, ViewChild, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { BasicService } from 'app/shared/models';
import { HqAlerter, FormGroupControlErrorDirective } from 'app/shared/directives';

export abstract class FormHandle<T> implements OnInit {

    protected formBuilder: FormBuilder;
    protected form: FormGroup;
    protected submitting: boolean;
    @Input()
    protected model: T;
    protected location: Location;
    @ViewChild(HqAlerter)
    protected alerter: HqAlerter;
    @ViewChildren(FormGroupControlErrorDirective)
    private controls: QueryList<FormGroupControlErrorDirective>;
    @Output()
    protected onSubmit = new EventEmitter<T>();

    ngOnInit() {
        this.getModel()
            .subscribe(model => {
                this.model = model;
                this.form = this.buidForm();
            }, err => console.error(err));
    }

    constructor(
        injector: Injector,
        protected service: BasicService<T>,
    ) {
        this.location = injector.get(Location);
        this.formBuilder = injector.get(FormBuilder);
    }

    /**
     * 表单是否有效（可以通过验证）
     */
    protected validate(): boolean {
        let invalid = this.controls
            .map(c => c.validate())
            .some(m => !m);
        return !invalid;
    }

    protected patchValue(name: string, value?: any) {
        this.model[name] = value;
        let obj = {};
        obj[name] = value;
        this.form.patchValue(obj);
    }

    protected onReset() {
        this.form = this.buidForm();
        this.form.reset(this.model);
        let f = this.form;
        this.form = null;
        setTimeout(() => this.form = f, 1);
    }

    protected onUpdate() {
        let valid = this.validate();
        if (!valid) {
            return false;
        }
        let model = this.form.value as T;
        this.submitting = true;
        return this.service
            .update(model)
            .then(data => {
                this.alerter.success('修改成功！');
                this.submitting = false;
                this.onSubmit.emit(model);
            })
            .catch(err => {
                this.alerter.error(err);
                this.submitting = false;
            });
    }

    protected onCreate() {
        let valid = this.validate();
        if (!valid) {
            return false;
        }
        let model = this.form.value as T;
        this.submitting = true;
        return this.service
            .create(model)
            .then(model => {
                this.alerter.success('添加成功！');
                this.onReset();
                this.submitting = false;
                this.onSubmit.emit(model);
            })
            .catch(err => {
                this.alerter.error(err);
                this.submitting = false;
            });
    }

    protected abstract getModel(): Observable<T>;

    protected abstract buidForm(): FormGroup;
}