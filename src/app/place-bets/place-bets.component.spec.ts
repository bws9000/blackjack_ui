import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceBetsComponent } from './place-bets.component';

describe('PlaceBetsComponent', () => {
  let component: PlaceBetsComponent;
  let fixture: ComponentFixture<PlaceBetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceBetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceBetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
