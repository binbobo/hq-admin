import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCreateComponent } from './maintain-create.component';

describe('MaintainCreateComponent', () => {
  let component: MaintainCreateComponent;
  let fixture: ComponentFixture<MaintainCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
