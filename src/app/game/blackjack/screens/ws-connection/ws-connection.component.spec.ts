import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebSocketConnectionComponent } from './ws-connection.component';


describe('WebSocketConnectionComponent', () => {
  let component: WebSocketConnectionComponent;
  let fixture: ComponentFixture<WebSocketConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSocketConnectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebSocketConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
