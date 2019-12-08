import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {WebsocketService} from "../websocket.service";

@Component({
  selector: 'app-socket-connect',
  templateUrl: './socket-connect.component.html',
  styleUrls: ['./socket-connect.component.css']
})
export class SocketConnectComponent implements OnInit, AfterViewInit {

  start: boolean;
  connected: string;

  constructor(private elementRef: ElementRef,
              public wss: WebsocketService) {
    if(!wss.socket) {
      this.connected = 'connecting...';
    }
    this.start = wss.start;
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
  }

  ngOnInit(): void {
    //this.wss.connected$.subscribe(this.wss.connectedObs);
    this.wss.startChange.subscribe(value => {
      //console.log('value: ' + value)
      if (value) {
        this.connected = 'connected';
      }
    });
  }

}
