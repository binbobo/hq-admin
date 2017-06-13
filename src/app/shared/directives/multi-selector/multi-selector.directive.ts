import { Directive, ElementRef, ViewContainerRef, Renderer, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentLoaderFactory, ComponentLoader, PopoverConfig } from 'ngx-bootstrap';
import { MultiSelectorComponent } from './multi-selector.component';
import { SelectOption } from 'app/shared/models';

@Directive({
  selector: '[hqMutilSelect]',
  exportAs: 'hq-mutil-select'
})
export class MultiSelectorDirective implements OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes) {
      this.selectItems(changes['options'].currentValue);
    }
  }

  private _selector: ComponentLoader<MultiSelectorComponent>;

  @Input('hqMutilSelect')
  public options: Array<SelectOption>;
  @Output()
  public onChange = new EventEmitter<SelectOption>();
  @Output()
  public onConfirm = new EventEmitter<MultiSelectConfirmEvent>();
  private onSubmit = new EventEmitter<Array<string>>();
  @Output()
  public onCancel = new EventEmitter();
  /**
   * Title of a popover.
   */
  @Input() public title: string;
  /**
   * Placement of a popover. Accepts: "top", "bottom", "left", "right"
   */
  @Input() public placement: 'top' | 'bottom' | 'left' | 'right';
  /**
   * Specifies events that should trigger. Supports a space separated list of
   * event names.
   */
  @Input() public triggers: string;
  /**
   * A selector specifying the element the popover should be appended to.
   * Currently only supports "body".
   */
  @Input() public container: string;

  /**
   * Returns whether or not the popover is currently being shown
   */
  @Input()
  public get isOpen(): boolean { return this._selector.isShown; }

  @Input()
  public emptyInfo: string;

  public set isOpen(value: boolean) {
    if (value) { this.show(); } else { this.hide(); }
  }
  /**
 * Emits an event when the popover is shown
 */
  @Output() public onShown: EventEmitter<any>;
  /**
   * Emits an event when the popover is hidden
   */
  @Output() public onHidden: EventEmitter<any>;

  constructor(
    private _elementRef: ElementRef,
    _renderer: Renderer,
    _viewContainerRef: ViewContainerRef,
    _config: PopoverConfig,
    cis: ComponentLoaderFactory
  ) {
    this._selector = cis
      .createLoader<MultiSelectorComponent>(_elementRef, _viewContainerRef, _renderer)
      .provide({ provide: PopoverConfig, useValue: _config });
    Object.assign(this, _config);
    this.onShown = this._selector.onShown;
    this.onHidden = this._selector.onHidden;
    this.onCancel.subscribe(() => this.hide());
    this.onSubmit.subscribe(value => {
      let event = new MultiSelectConfirmEvent(_elementRef, value, this.options);
      this.onConfirm.emit(event);
      this.selectItems(value);
    })
  }

  private selectItems(items: Array<any>) {
    items = Array.isArray(items) ? items : [];
    let length = items.filter(m => typeof m === 'string' || m.checked).length;
    if (this._elementRef.nativeElement instanceof HTMLInputElement) {
      let input = this._elementRef.nativeElement as HTMLInputElement;
      input.readOnly = true;
      let text = '点击选择';
      length && (text = `选择了${length}项数据`);
      input.value = text;
    }
  }

  public show(): void {
    if (this._selector.isShown) {
      return;
    }
    this._selector
      .attach(MultiSelectorComponent)
      .to(this.container)
      .position({ attachment: this.placement })
      .show({
        placement: this.placement,
        title: this.title,
        options: this.options,
        onChange: this.onChange,
        onConfirm: this.onSubmit,
        onCancel: this.onCancel,
        emptyInfo: this.emptyInfo,
      });
    this.isOpen = true;
  }

  /**
   * Closes an element’s popover. This is considered a “manual” triggering of
   * the popover.
   */
  public hide(): void {
    if (this.isOpen) {
      this._selector.hide();
      this.isOpen = false;
    }
  }

  public toggle(): void {
    if (this.isOpen) {
      return this.hide();
    }

    this.show();
  }

  public ngOnInit(): any {
    this._selector.listen({
      triggers: this.triggers,
      show: () => this.show()
    });
    this.onConfirm.subscribe(() => this.hide());
  }

  public ngOnDestroy(): any {
    this._selector.dispose();
  }

}

export class MultiSelectConfirmEvent {
  constructor(
    public el: ElementRef,
    public value: Array<string>,
    public source: Array<SelectOption>
  ) { }
}
