import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAddFormComponent } from './customer-add-form.component';

describe('CustomerAddFormComponent', () => {
  let component: CustomerAddFormComponent;
  let fixture: ComponentFixture<CustomerAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
