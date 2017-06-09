import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TreeItem, SelectedTreeItem } from '../tree-item';

@Component({
  selector: 'hq-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  host: {
    style: 'display:block;padding-left:20px;'
  }
})
export class TreeComponent implements OnInit {

  @Input()
  public parent: TreeItem;
  @Input()
  public items: Array<TreeItem>;
  @Input()
  public auto: boolean;
  @Input()
  public collapsed: boolean;
  @Input()
  public text: string;
  @Input()
  public value: string;
  @Input()
  public children: string;
  @Output()
  public onChange: EventEmitter<Array<SelectedTreeItem>> = new EventEmitter<any>();
  private total: number;
  private allChecked: boolean;

  constructor() { }

  ngOnInit() {
    this.items && this.items.forEach(m => {
      m.collapsed = m.collapsed || this.collapsed;
      m.parent = this.parent;
    });
    if (!this.parent) {
      this.total = this.init(this.items);
      this.emitChange();
    }
  }

  private itemChange(event: Event, item: TreeItem) {
    let element = event.target as HTMLInputElement;
    item.checked = element.checked;
    if (this.auto) {
      this.checkParents(item.parent);
      this.checkChildren(item.children, item.checked);
    }
    this.emitChange();
  }

  private allChange(event: Event) {
    let element = event.target as HTMLInputElement;
    this.checkChildren(this.items, element.checked);
    this.emitChange();
  }

  private getSelectedItems(items: Array<TreeItem>): Array<SelectedTreeItem> {
    let array = new Array();
    if (!items) return array;
    items.forEach(m => {
      if (m.checked) {
        array.push({ text: m.text, value: m.value });
      }
      array = array.concat(this.getSelectedItems(m.children));
    })
    return array;
  }

  private isChecked(item: TreeItem) {
    let checked = item.checked;
    return checked || undefined;
  }

  private checkChildren(children: Array<TreeItem>, checked: boolean) {
    if (!children) return;
    children.forEach(element => {
      element.checked = checked;
      this.checkChildren(element.children, checked);
    });
  }

  private checkParents(parent: TreeItem) {
    if (!parent || !parent.children) return;
    parent.checked = parent.children.every(m => m.checked);
    this.checkParents(parent.parent);
  }

  private emitChange(event?: Array<SelectedTreeItem>) {
    let selectedItems = this.getSelectedItems(this.items);
    this.onChange.emit(selectedItems);
    if (!this.parent) {
      this.allChecked = this.total === selectedItems.length;
    }
  }

  private init(items: Array<TreeItem>): number {
    let count = 0;
    if (!items) return count;
    items.forEach(m => {
      if (this.text && this.text !== 'text') {
        m.text = m[this.text];
      }
      if (this.value && this.value !== 'value') {
        m.value = m[this.value];
      }
      if (this.children && this.children !== 'children') {
        m.children = m[this.children];
      }
      count++;
      count += this.init(m.children);
    })
    return count;
  }

}
