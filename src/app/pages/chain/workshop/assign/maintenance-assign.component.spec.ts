import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceAsignComponent } from './maintenance-asign.component';

describe('MaintenanceAsignComponent', () => {
  let component: MaintenanceAsignComponent;
  let fixture: ComponentFixture<MaintenanceAsignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceAsignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceAsignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
