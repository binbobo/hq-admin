import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreCheckOrderDetailComponent } from './pre-check-order-detail.component';

describe('PreCheckOrderDetailComponent', () => {
  let component: PreCheckOrderDetailComponent;
  let fixture: ComponentFixture<PreCheckOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreCheckOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreCheckOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
