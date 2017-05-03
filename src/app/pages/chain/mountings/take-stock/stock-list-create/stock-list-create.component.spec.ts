import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockListCreateComponent } from './stock-list-create.component';

describe('StockListCreateComponent', () => {
  let component: StockListCreateComponent;
  let fixture: ComponentFixture<StockListCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockListCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
