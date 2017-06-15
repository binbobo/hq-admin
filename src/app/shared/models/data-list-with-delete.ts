import { DataList } from './data-list';
import { Injector } from '@angular/core';
import { PagedService, DeleteService } from './basic-service.interface';
import { SweetAlertService } from "app/shared/services";

export abstract class DataListWithDelete<T> extends DataList<T>  {

    constructor(
        injector: Injector,
        protected service: DeleteService & PagedService<T>,
        private sweetAlertService: SweetAlertService,
    ) {
        super(injector, service)
    }

    protected onDelete($event: Event, id: string) {
        // if (!confirm('确定要删除？')) return false;
        this.sweetAlertService.confirm({ text: '确定要删除？', type: 'warning' })
            .then(() => {
                let el = $event.target as HTMLInputElement;
                el.disabled = true;
                this.service.delete(id)
                    .then(() => {
                        this.alerter.success('删除成功！');
                        this.loadList();
                    })
                    .catch(err => {
                        this.alerter.error(err);
                        el.disabled = false;
                    });
            }, () => { })
    }
}
