import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAllocateComponent } from './role-allocate.component';

describe('RoleAllocateComponent', () => {
  let component: RoleAllocateComponent;
  let fixture: ComponentFixture<RoleAllocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleAllocateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAllocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
