import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  showSelector:boolean;

  ngOnInit() {

  }

  options = [{ text: 'text1', value: 'value1', selected: true }, { text: 'text2', value: 'value2', selected: true }, { text: 'text3', value: 'value3' }];

  onChange(item) {
    console.log(item);
  }

  onConfirm(){
    console.log('已确认');
  }
}
