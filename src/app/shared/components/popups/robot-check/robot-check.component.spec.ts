import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotCheckComponent } from './robot-check.component';

describe('RobotCheckComponent', () => {
  let component: RobotCheckComponent;
  let fixture: ComponentFixture<RobotCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RobotCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RobotCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
