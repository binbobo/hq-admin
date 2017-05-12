import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarownerComponent } from './edit-carowner.component';

describe('EditCarownerComponent', () => {
  let component: EditCarownerComponent;
  let fixture: ComponentFixture<EditCarownerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCarownerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
