import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveExperienceDesignerHomeComponent } from './live-experience-designer-home.component';

describe('LiveExperienceDesignerHomeComponent', () => {
  let component: LiveExperienceDesignerHomeComponent;
  let fixture: ComponentFixture<LiveExperienceDesignerHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveExperienceDesignerHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveExperienceDesignerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
