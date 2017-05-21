import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributePrintComponent } from './distribute-print.component';

describe('DistributePrintComponent', () => {
  let component: DistributePrintComponent;
  let fixture: ComponentFixture<DistributePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
