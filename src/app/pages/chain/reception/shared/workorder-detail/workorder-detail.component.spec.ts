import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderDetailComponent } from './workorder-detail.component';

describe('WorkorderDetailComponent', () => {
  let component: WorkorderDetailComponent;
  let fixture: ComponentFixture<WorkorderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
