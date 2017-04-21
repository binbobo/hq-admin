import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeEditComponent } from './scope-edit.component';

describe('ScopeEditComponent', () => {
  let component: ScopeEditComponent;
  let fixture: ComponentFixture<ScopeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScopeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScopeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
