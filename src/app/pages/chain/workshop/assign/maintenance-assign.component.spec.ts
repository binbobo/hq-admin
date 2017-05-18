import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAssignComponent } from './maintenance-assign.component';

describe('MaintenanceAsignComponent', () => {
  let component: MaintenanceAssignComponent;
  let fixture: ComponentFixture<MaintenanceAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
