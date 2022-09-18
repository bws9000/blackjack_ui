import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateHumanComponent } from './validate-human.component';

describe('ValidateHumanComponent', () => {
  let component: ValidateHumanComponent;
  let fixture: ComponentFixture<ValidateHumanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateHumanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateHumanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
