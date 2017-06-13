import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderBasicInfoComponent } from './workorder-basic-info.component';

describe('WorkorderBasicInfoComponent', () => {
  let component: WorkorderBasicInfoComponent;
  let fixture: ComponentFixture<WorkorderBasicInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkorderBasicInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
