import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicingPrintComponent } from './invoicing-print.component';

describe('InvoicingPrintComponent', () => {
  let component: InvoicingPrintComponent;
  let fixture: ComponentFixture<InvoicingPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicingPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicingPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
