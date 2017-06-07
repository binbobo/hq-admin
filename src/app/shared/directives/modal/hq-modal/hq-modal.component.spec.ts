import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HqModalComponent } from './hq-modal.component';

describe('HqModalComponent', () => {
  let component: HqModalComponent;
  let fixture: ComponentFixture<HqModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HqModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HqModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
