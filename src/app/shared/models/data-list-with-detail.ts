import { ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { DetailService } from "app/shared/models";
import { PagedService } from './basic-service.interface';
import { DataList } from './data-list';

export abstract class DataListWithDetail<T> extends DataList<T> {

    @ViewChild("detailModal")
    protected detailModal: ModalDirective;
    protected model: T;

    constructor(
        injector: Injector,
        protected service: DetailService<T> & PagedService<T>
    ) {
        super(injector, service);
    }

    protected showModal(id: string): void {
        this.service.get(id)
            .then(log => {
                this.model = log;
                this.detailModal.show();
            })
            .catch(err => this.alerter.error(err))
    }
}
