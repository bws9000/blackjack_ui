import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {InitModule} from "./init/init.module";
import {WebsocketService} from "./websocket.service";

@Component({
  providers: [InitModule, WebsocketService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  table: string = 'connecting...';
  tableDivBackground: string ='';

  constructor(private initModule: InitModule,
              private wss: WebsocketService,
              private elementRef: ElementRef) {
    //wss.connect();
    wss.authConnect();
  }

  onConnect(data: any) {
    console.log('initEmit: ' + JSON.stringify(data));
    this.table = 'connected';
    this.tableDivBackground = 'darkgreen';
  }

  ngOnInit(): void {
    this.wss.emit('init', {msg: ''});
    this.wss
      .onEvent('initEmit')
      .subscribe(data => this.onConnect(data));
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
  }

}
