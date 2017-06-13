import { Component, OnInit, Input, HostListener, HostBinding, ElementRef, EventEmitter, Output } from '@angular/core';
import { TreeItem, SelectedTreeItem } from '../tree-item';

@Component({
  selector: 'hq-dropdown-tree',
  templateUrl: './dropdown-tree.component.html',
  styleUrls: ['./dropdown-tree.component.css'],
  host: {
    style: 'position:relative;display:block',
    class: 'custom',
  }
})
export class DropdownTreeComponent implements OnInit {

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
  private isShown: boolean;
  private selectedItems: Array<SelectedTreeItem>;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    document.body.addEventListener('click', (event: Event) => {
      event.stopPropagation;
      let innerClick = this.el.nativeElement === event.target || this.el.nativeElement.contains(event.target);
      if (!innerClick) {
        this.isShown = false;
      } else {
        let el = event.target as HTMLElement;
        if (el.classList.contains('toggle')) {
          this.isShown = !this.isShown;
        }
      }
    });
  }

  itemChange(items: Array<SelectedTreeItem>) {
    this.selectedItems = items;
    this.onChange.emit(items);
  }

  get selectValue() {
    let value = '请选择...';
    if (this.selectedItems && this.selectedItems.length) {
      value = this.selectedItems.map(m => m.text).join();
    }
    return value;
  }
}
