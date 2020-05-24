import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LedHomeComponent } from './led-home.component';

describe('LedHomeComponent', () => {
  let component: LedHomeComponent;
  let fixture: ComponentFixture<LedHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LedHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LedHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
