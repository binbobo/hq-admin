import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainPrintComponent } from './maintain-print.component';

describe('MaintainPrintComponent', () => {
  let component: MaintainPrintComponent;
  let fixture: ComponentFixture<MaintainPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
