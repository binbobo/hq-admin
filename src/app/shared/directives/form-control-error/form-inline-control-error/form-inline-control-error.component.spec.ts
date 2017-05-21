import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInlineControlErrorComponent } from './form-inline-control-error.component';

describe('FormInlineControlErrorComponent', () => {
  let component: FormInlineControlErrorComponent;
  let fixture: ComponentFixture<FormInlineControlErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInlineControlErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInlineControlErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
