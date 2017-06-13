import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleShowComponent } from './vehicle-show.component';

describe('VehicleShowComponent', () => {
  let component: VehicleShowComponent;
  let fixture: ComponentFixture<VehicleShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
