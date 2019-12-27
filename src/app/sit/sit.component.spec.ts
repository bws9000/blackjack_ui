import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SitComponent } from './sit.component';

describe('SitComponent', () => {
  let component: SitComponent;
  let fixture: ComponentFixture<SitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
