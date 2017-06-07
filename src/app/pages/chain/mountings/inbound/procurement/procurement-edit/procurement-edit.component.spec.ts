import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementEditComponent } from './procurement-edit.component';

describe('ProcurementEditComponent', () => {
  let component: ProcurementEditComponent;
  let fixture: ComponentFixture<ProcurementEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
