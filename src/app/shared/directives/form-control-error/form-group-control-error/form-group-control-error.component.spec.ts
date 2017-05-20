import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGroupControlErrorComponent } from './form-group-control-error.component';

describe('FormGroupControlErrorComponent', () => {
  let component: FormGroupControlErrorComponent;
  let fixture: ComponentFixture<FormGroupControlErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormGroupControlErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormGroupControlErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
