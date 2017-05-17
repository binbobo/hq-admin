import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarOwnerDetailComponent } from './car-owner-detail.component';

describe('CarOwnerDetailComponent', () => {
  let component: CarOwnerDetailComponent;
  let fixture: ComponentFixture<CarOwnerDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarOwnerDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarOwnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
