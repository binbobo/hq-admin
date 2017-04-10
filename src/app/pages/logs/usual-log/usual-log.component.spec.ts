import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsualLogComponent } from './usual-log.component';

describe('UsualLogComponent', () => {
  let component: UsualLogComponent;
  let fixture: ComponentFixture<UsualLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsualLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsualLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
