import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceItemListComponent } from './maintenance-item-list.component';

describe('MaintenanceItemListComponent', () => {
  let component: MaintenanceItemListComponent;
  let fixture: ComponentFixture<MaintenanceItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
