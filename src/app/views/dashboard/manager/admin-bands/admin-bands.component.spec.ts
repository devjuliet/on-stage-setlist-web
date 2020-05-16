import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBandsComponent } from './admin-bands.component';

describe('AdminBandsComponent', () => {
  let component: AdminBandsComponent;
  let fixture: ComponentFixture<AdminBandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminBandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminBandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
