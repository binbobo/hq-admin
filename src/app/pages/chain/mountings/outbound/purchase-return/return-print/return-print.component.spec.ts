import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPrintComponent } from './return-print.component';

describe('ReturnPrintComponent', () => {
  let component: ReturnPrintComponent;
  let fixture: ComponentFixture<ReturnPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
