import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalValueComponent } from './total-value.component';

describe('TotalValueComponent', () => {
  let component: TotalValueComponent;
  let fixture: ComponentFixture<TotalValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
