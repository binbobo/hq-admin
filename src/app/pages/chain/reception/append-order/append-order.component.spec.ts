import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendOrderComponent } from './append-order.component';

describe('AppendOrderComponent', () => {
  let component: AppendOrderComponent;
  let fixture: ComponentFixture<AppendOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppendOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppendOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
