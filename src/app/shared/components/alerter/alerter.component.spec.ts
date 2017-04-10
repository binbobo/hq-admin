import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlerterComponent } from './alerter.component';

describe('AlerterComponent', () => {
  let component: AlerterComponent;
  let fixture: ComponentFixture<AlerterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlerterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlerterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
