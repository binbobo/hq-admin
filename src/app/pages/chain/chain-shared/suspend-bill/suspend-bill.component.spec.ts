import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendBillComponent } from './suspend-bill.component';

describe('SuspendBillComponent', () => {
  let component: SuspendBillComponent;
  let fixture: ComponentFixture<SuspendBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuspendBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuspendBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
