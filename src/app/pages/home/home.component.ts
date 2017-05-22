import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, TypeaheadRequestParams } from "app/shared/directives";
import { PagedResult } from 'app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
