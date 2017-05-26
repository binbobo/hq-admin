import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePrintComponent } from './receive-print.component';

describe('ReceivePrintComponent', () => {
  let component: ReceivePrintComponent;
  let fixture: ComponentFixture<ReceivePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
