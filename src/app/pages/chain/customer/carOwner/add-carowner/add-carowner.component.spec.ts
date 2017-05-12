import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCarownerComponent } from './add-carowner.component';

describe('AddCarownerComponent', () => {
  let component: AddCarownerComponent;
  let fixture: ComponentFixture<AddCarownerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCarownerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCarownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
