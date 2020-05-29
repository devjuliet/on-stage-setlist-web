import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepertoriesComponent } from './repertories.component';

describe('RepertoriesComponent', () => {
  let component: RepertoriesComponent;
  let fixture: ComponentFixture<RepertoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepertoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepertoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
