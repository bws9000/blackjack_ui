import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-socket-connect',
  templateUrl: './socket-connect.component.html',
  styleUrls: ['./socket-connect.component.css']
})
export class SocketConnectComponent implements OnInit {

  start: boolean;
  connected: string;

  constructor() {
    this.logStuff('SOCKETCONNECTCOMPONENT CONSTRUCTOR');
    /*
    if(!wss.socket) {
      this.connected = 'connecting...';
    }
    this.start = wss.start;
    */
  }

  ngOnInit(): void {
    //this.wss.connected$.subscribe(this.wss.connectedObs);
    /*
    this.wss.startChange.subscribe(value => {
      //console.log('value: ' + value)
      if (value) {
        this.connected = 'connected';
      }
    });
     */
  }

  logStuff(stuff:any){
    if(!environment.production){
      console.log(stuff);
    }
  }

}
