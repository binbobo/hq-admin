import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClippedWordComponent } from './clipped-word.component';

describe('ClippedWordComponent', () => {
  let component: ClippedWordComponent;
  let fixture: ComponentFixture<ClippedWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClippedWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClippedWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
