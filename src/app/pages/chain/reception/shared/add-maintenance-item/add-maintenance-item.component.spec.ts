import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaintenanceItemComponent } from './add-maintenance-item.component';

describe('AddMaintenanceItemComponent', () => {
  let component: AddMaintenanceItemComponent;
  let fixture: ComponentFixture<AddMaintenanceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMaintenanceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaintenanceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
