import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HqAlerterComponent } from './hq-alerter.component';

describe('HqAlerterComponent', () => {
  let component: HqAlerterComponent;
  let fixture: ComponentFixture<HqAlerterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HqAlerterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HqAlerterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
