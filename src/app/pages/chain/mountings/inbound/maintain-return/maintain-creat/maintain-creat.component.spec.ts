import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainCreatComponent } from './maintain-creat.component';

describe('MaintainCreatComponent', () => {
  let component: MaintainCreatComponent;
  let fixture: ComponentFixture<MaintainCreatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintainCreatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainCreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
