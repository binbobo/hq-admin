import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOrderComponent } from './bill-order.component';

describe('BillOrderComponent', () => {
  let component: BillOrderComponent;
  let fixture: ComponentFixture<BillOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
