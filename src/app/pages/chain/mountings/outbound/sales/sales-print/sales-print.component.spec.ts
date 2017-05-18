import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPrintComponent } from './sales-print.component';

describe('SalesPrintComponent', () => {
  let component: SalesPrintComponent;
  let fixture: ComponentFixture<SalesPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
