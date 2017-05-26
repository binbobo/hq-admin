import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartssalesPrintComponent } from './partssales-print.component';

describe('PartssalesPrintComponent', () => {
  let component: PartssalesPrintComponent;
  let fixture: ComponentFixture<PartssalesPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartssalesPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartssalesPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
