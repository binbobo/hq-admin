import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerReceiveComponent } from './inner-receive.component';

describe('InnerReceiveComponent', () => {
  let component: InnerReceiveComponent;
  let fixture: ComponentFixture<InnerReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
