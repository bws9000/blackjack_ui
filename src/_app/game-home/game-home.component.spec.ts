import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { GameHomeComponent } from './game-home.component';

describe('GameHomeComponent', () => {
  let component: GameHomeComponent;
  let fixture: ComponentFixture<GameHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GameHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
