import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderDetailPrintComponent } from './workorder-detail-print.component';

describe('WorkorderDetailPrintComponent', () => {
  let component: WorkorderDetailPrintComponent;
  let fixture: ComponentFixture<WorkorderDetailPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderDetailPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderDetailPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
