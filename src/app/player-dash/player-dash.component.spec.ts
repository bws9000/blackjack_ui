import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDashComponent } from './player-dash.component';

describe('PlayerDashComponent', () => {
  let component: PlayerDashComponent;
  let fixture: ComponentFixture<PlayerDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
