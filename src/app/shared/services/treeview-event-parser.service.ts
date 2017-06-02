import { TreeviewEventParser } from "ngx-treeview/lib";
import { Injectable } from '@angular/core';
import { TreeviewComponent } from 'ngx-treeview';

@Injectable()
class HQTreeviewEventParser extends TreeviewEventParser {
    getSelectedChange(component: TreeviewComponent): any[] {
        const checkedItems = component.checkedItems;
        if (checkedItems) {
            return checkedItems.map(item => ({ text: item.text, value: item.value }));
        }
        return [];
    }
}

export const treeviewEventParser = { provide: TreeviewEventParser, useClass: HQTreeviewEventParser };