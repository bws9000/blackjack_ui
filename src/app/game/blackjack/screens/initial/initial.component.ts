import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage/session-storage.service';
import { WsService } from 'src/app/shared/services/ws/ws.service';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.scss'],
})
export class InitialComponent {
  //userInitialConnection
  //add

  // ID 2 is socketconnected sendMessage
  content: string;

  //content = '{"jsonrpc":"2.0", "method":"userInitialConnection", "params":[{"data": {"x":"1","y":"2"}}, "latest"], "id":"1"}';
  //content = '{"jsonrpc":"2.0", "method":"userInitialConnection", "params":[{"data": {"wsconnected":"false"}}, "latest"], "id":"2"}';
  constructor(
    private wsService: WsService,
    private sessionStorageService: SessionStorageService
  ) {
    //if you're here you have a socketid
    const socketid = this.sessionStorageService.getUserSocketID();
    this.content = `{"jsonrpc":"2.0", "method":"add", "params":[{"data": {"x":"1","y":"2","id":"${socketid}"}}], "id":"2"}`;
    this.wsService.messages = new Subject<any>(); // avoid message pile-up
    // this.wsService.messages.subscribe((message)=>{
    //   console.log(message);
    // })
  }
  send(): void {
    this.wsService.send(JSON.parse(this.content));
  }
}
