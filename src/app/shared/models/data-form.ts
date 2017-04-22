import { OnInit, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { BasicService } from 'app/shared/models';
import { HqAlerter } from 'app/shared/directives';

export abstract class FormHandle<T> implements OnInit {

    protected formBuilder: FormBuilder;
    protected form: FormGroup;
    protected submitting: boolean;
    protected model: T;
    protected location: Location;
    @ViewChild(HqAlerter)
    protected alerter: HqAlerter;

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

    protected onReset() {
        this.form.reset(this.model);
        let f = this.form;
        this.form = null;
        setTimeout(() => this.form = f, 1);
    }

    protected onUpdate() {
        let model = this.form.value as T;
        this.submitting = true;
        return this.service
            .update(model)
            .then(model => {
                this.alerter.success('修改成功！');
                this.location.back();
                this.submitting = false;
            })
            .catch(err => {
                this.alerter.error(err);
                this.submitting = false;
            });
    }

    protected onCreate() {
        let model = this.form.value as T;
        this.submitting = true;
        return this.service
            .create(model)
            .then(model => {
                this.alerter.success('添加成功！');
                this.form.reset(this.model);
                this.submitting = false;
            })
            .catch(err => {
                this.alerter.error(err);
                this.submitting = false;
            });
    }

    protected abstract getModel(): Observable<T>;

    protected abstract buidForm(): FormGroup;
}