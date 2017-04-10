import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpLogComponent } from './http-log.component';

describe('HttpLogComponent', () => {
  let component: HttpLogComponent;
  let fixture: ComponentFixture<HttpLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
