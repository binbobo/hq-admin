import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPrintDetailComponent } from './checkout-print-detail.component';

describe('CheckoutPrintDetailComponent', () => {
  let component: CheckoutPrintDetailComponent;
  let fixture: ComponentFixture<CheckoutPrintDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutPrintDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPrintDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
