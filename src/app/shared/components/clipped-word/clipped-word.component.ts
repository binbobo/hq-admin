import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'clipped-word',
  templateUrl: './clipped-word.component.html',
  styleUrls: ['./clipped-word.component.css']
})
export class ClippedWordComponent implements OnInit {

  @Input()
  private length: number;
  @Input("content")
  private _content: string;
  @Input()
  private placement: string;

  constructor() { }

  ngOnInit() {
    if (this._content) {
      this._content = this._content.trim();
    }
    this.placement = this.placement || "bottom";
  }

  private get content(): string {
    if (!this.needClip) return this._content;
    return this._content.substr(0, this.length).concat('...');
  }

  private get needClip(): boolean {
    if (!this.length) return false;
    if (!this._content) return false;
    return this._content.length > this.length;
  }

}
