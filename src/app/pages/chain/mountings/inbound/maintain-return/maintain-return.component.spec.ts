import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainReturnComponent } from './maintain-return.component';

describe('MaintainReturnComponent', () => {
  let component: MaintainReturnComponent;
  let fixture: ComponentFixture<MaintainReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
