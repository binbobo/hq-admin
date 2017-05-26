import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementPrintComponent } from './procurement-print.component';

describe('ProcurementPrintComponent', () => {
  let component: ProcurementPrintComponent;
  let fixture: ComponentFixture<ProcurementPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
