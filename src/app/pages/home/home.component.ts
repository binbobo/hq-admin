import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter } from "app/shared/directives";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  @ViewChild(HqAlerter)
  alerter: HqAlerter;

  showSelector: boolean;

  ngOnInit() {
    this.alerter.info('12345!', true, 0);
  }

  options = [{ text: 'text1', value: 'value1', selected: true }, { text: 'text2', value: 'value2', selected: true }, { text: 'text3', value: 'value3' }];

  onChange(item) {
    console.log(item);
  }

  onConfirm() {
    console.log('已确认');
  }

  public selected: string;
  public states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico',
    'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'];
}
