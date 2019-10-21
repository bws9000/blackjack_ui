import { Component } from '@angular/core';
import { SocketStatusComponent } from './socket-status/socket-status.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Blackjack Angular 7 Client';
  constructor() {
    //
  }
}
