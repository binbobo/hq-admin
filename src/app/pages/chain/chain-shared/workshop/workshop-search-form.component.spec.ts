import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopSearchFormComponent } from './workshop-serarch-form.component';

describe('WorkshopSearchFormComponent', () => {
  let component: WorkshopSearchFormComponent;
  let fixture: ComponentFixture<WorkshopSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
