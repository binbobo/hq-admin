import { TreeviewItem, TreeviewI18n } from 'ngx-treeview';
import { Injectable } from '@angular/core';

@Injectable()
class TreeviewI18nCN extends TreeviewI18n {
    getText(checkededItems: TreeviewItem[], isAll: boolean): string {
        if (isAll) {
            return '全部';
        }
        switch (checkededItems.length) {
            case 0:
                return '请选择';
            case 1:
                return checkededItems[0].text;
            default:
                return `已选择${checkededItems.length}项`;
        }
    }

    allCheckboxText(): string {
        return '全部';
    }

    filterPlaceholder(): string {
        return '搜索';
    }

    filterNoItemsFoundText(): string {
        return '找不到任何项目';
    }

    tooltipCollapseExpand(isCollapse: boolean): string {
        return isCollapse ? '展开' : '收起';
    }
}

export const treeviewI18nProvider = { provide: TreeviewI18n, useClass: TreeviewI18nCN };