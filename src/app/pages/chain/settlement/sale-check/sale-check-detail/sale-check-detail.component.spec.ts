import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCheckDetailComponent } from './sale-check-detail.component';

describe('SaleCheckDetailComponent', () => {
  let component: SaleCheckDetailComponent;
  let fixture: ComponentFixture<SaleCheckDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleCheckDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleCheckDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
