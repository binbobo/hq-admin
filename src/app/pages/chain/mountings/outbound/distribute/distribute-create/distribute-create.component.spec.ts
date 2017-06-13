import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeCreatComponent } from './distribute-creat.component';

describe('DistributeCreatComponent', () => {
  let component: DistributeCreatComponent;
  let fixture: ComponentFixture<DistributeCreatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributeCreatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeCreatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
