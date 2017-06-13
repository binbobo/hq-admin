import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceFixingsListComponent } from './maintenance-fixings-list.component';

describe('MaintenanceFixingsListComponent', () => {
  let component: MaintenanceFixingsListComponent;
  let fixture: ComponentFixture<MaintenanceFixingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceFixingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceFixingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
