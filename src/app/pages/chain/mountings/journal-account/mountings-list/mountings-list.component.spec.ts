import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MountingsListComponent } from './mountings-list.component';

describe('MountingsListComponent', () => {
  let component: MountingsListComponent;
  let fixture: ComponentFixture<MountingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MountingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MountingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
