import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReturnPrintComponent } from './sales-return-print.component';

describe('SalesReturnPrintComponent', () => {
  let component: SalesReturnPrintComponent;
  let fixture: ComponentFixture<SalesReturnPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReturnPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReturnPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
