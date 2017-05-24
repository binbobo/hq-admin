import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedItemListComponent } from './suggested-item-list.component';

describe('SuggestedItemListComponent', () => {
  let component: SuggestedItemListComponent;
  let fixture: ComponentFixture<SuggestedItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
