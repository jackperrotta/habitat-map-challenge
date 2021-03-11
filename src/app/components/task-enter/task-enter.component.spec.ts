import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEnterComponent } from './task-enter.component';

describe('TaskEnterComponent', () => {
  let component: TaskEnterComponent;
  let fixture: ComponentFixture<TaskEnterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskEnterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskEnterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
