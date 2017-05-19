import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSuggestItemComponent } from './add-suggest-item.component';

describe('AddSuggestItemComponent', () => {
  let component: AddSuggestItemComponent;
  let fixture: ComponentFixture<AddSuggestItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSuggestItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSuggestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
