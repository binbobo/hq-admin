import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartssalesComponent } from './partssales.component';

describe('PartssalesComponent', () => {
  let component: PartssalesComponent;
  let fixture: ComponentFixture<PartssalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartssalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartssalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
