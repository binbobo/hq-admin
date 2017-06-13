import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttachItemComponent } from './add-attach-item.component';

describe('AddAttachItemComponent', () => {
  let component: AddAttachItemComponent;
  let fixture: ComponentFixture<AddAttachItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttachItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttachItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
