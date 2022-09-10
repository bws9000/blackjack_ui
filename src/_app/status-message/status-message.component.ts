import {Component, OnInit} from '@angular/core';
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {timer} from 'rxjs';
import {StatusMessageService} from "../services/status-message.service";

@Component({
  selector: 'app-status-message',
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.css']
})
export class StatusMessageComponent implements OnInit {
  hideTime: number;
  status: string;
  content: string;
  hidden: boolean;
  statusBoxVisible: string;

  constructor(private wss: WebsocketService,
              private sms:StatusMessageService) {
    this.hideTime = 2000;
    this.content = 'content';
    this.statusBoxVisible = 'hidden';
    this.sms.message.subscribe(value=>{
      this.showDialog(value);
    });
  }

  showDialog(message) {
    this.content = message;
    this.statusBoxVisible = 'visible';
    this.hideDialog();
  }

  hideDialog() {
    const timerOne = timer(this.hideTime);
    timerOne.subscribe(val => {
      //val
      this.statusBoxVisible = 'hidden';
    });
  }

  actionStatusEmit(data) {
    this.wss.startChange.next(true);
    this.showDialog(data.status);
  }

  ngOnInit() {

  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
