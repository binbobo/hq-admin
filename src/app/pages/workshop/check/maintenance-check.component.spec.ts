import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceCheckComponent } from './maintenance-check.component';

describe('MaintenanceCheckComponent', () => {
  let component: MaintenanceCheckComponent;
  let fixture: ComponentFixture<MaintenanceCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
