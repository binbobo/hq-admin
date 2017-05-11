import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnCreateComponent } from './return-create.component';

describe('ReturnCreateComponent', () => {
  let component: ReturnCreateComponent;
  let fixture: ComponentFixture<ReturnCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
