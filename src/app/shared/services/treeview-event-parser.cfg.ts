import { TreeviewEventParser } from "ngx-treeview";
import { Injectable } from '@angular/core';
import { TreeviewComponent, TreeviewItem } from 'ngx-treeview';
import { element } from 'protractor';

@Injectable()
export class HQTreeviewEventParser extends TreeviewEventParser {
    getSelectedChange(component: TreeviewComponent): any[] {
        const checkedItems = this.getCheckedItems(component.items);
        return checkedItems;
    }

    private getCheckedItems(items: Array<TreeviewItem>) {
        let array = new Array();
        if (!items) return array;
        items.forEach(element => {
            if (element.checked) {
                array.push({ text: element.text, value: element.value });
            }
            array = array.concat(this.getCheckedItems(element.children));
        });
        return array;
    }
}

export const treeviewEventParser = { provide: TreeviewEventParser, useClass: HQTreeviewEventParser };