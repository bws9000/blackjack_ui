import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerboxComponent } from './playerbox.component';

describe('PlayerboxComponent', () => {
  let component: PlayerboxComponent;
  let fixture: ComponentFixture<PlayerboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
