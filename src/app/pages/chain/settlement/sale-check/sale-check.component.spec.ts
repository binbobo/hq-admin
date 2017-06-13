import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleCheckComponent } from './sale-check.component';

describe('SaleCheckComponent', () => {
  let component: SaleCheckComponent;
  let fixture: ComponentFixture<SaleCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
