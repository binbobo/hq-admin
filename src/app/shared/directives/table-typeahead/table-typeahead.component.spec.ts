import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTypeaheadComponent } from './table-typeahead.component';

describe('TableTypeaheadComponent', () => {
  let component: TableTypeaheadComponent;
  let fixture: ComponentFixture<TableTypeaheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableTypeaheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
