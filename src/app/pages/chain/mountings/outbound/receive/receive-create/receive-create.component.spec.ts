import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveCreateComponent } from './receive-create.component';

describe('ReceiveCreateComponent', () => {
  let component: ReceiveCreateComponent;
  let fixture: ComponentFixture<ReceiveCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
