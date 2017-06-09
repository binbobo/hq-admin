export interface TreeItem {
    text: string;
    value: any;
    disabled?: boolean;
    checked?: boolean;
    collapsed?: boolean;
    parent?: TreeItem;
    children?: TreeItem[];
}

export interface SelectedTreeItem {
    text: string;
    value: any;
}