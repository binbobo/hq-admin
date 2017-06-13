import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentItemListComponent } from './attachment-item-list.component';

describe('AttachmentItemListComponent', () => {
  let component: AttachmentItemListComponent;
  let fixture: ComponentFixture<AttachmentItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachmentItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
