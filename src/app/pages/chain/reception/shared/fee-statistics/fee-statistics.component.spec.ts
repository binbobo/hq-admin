import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeStatisticsComponent } from './fee-statistics.component';

describe('FeeStatisticsComponent', () => {
  let component: FeeStatisticsComponent;
  let fixture: ComponentFixture<FeeStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
