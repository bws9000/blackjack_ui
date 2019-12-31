import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerHandComponent } from './dealer-hand.component';

describe('DealerHandComponent', () => {
  let component: DealerHandComponent;
  let fixture: ComponentFixture<DealerHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
