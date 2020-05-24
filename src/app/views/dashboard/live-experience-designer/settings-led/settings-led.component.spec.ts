import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLedComponent } from './settings-led.component';

describe('SettingsLedComponent', () => {
  let component: SettingsLedComponent;
  let fixture: ComponentFixture<SettingsLedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsLedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
