import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopOrderOperationComponent } from './workshop-order-operation.component';

describe('WorkshopOrderOperationComponent', () => {
  let component: WorkshopOrderOperationComponent;
  let fixture: ComponentFixture<WorkshopOrderOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopOrderOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopOrderOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
