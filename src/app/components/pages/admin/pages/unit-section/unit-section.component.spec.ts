import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSectionComponent } from './unit-section.component';

describe('UnitSectionComponent', () => {
  let component: UnitSectionComponent;
  let fixture: ComponentFixture<UnitSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnitSectionComponent]
    });
    fixture = TestBed.createComponent(UnitSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
