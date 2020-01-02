import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatusUpdateService} from "../status-update.service";
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {TableService} from "../table.service";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit, OnDestroy {

  statusBoxVisible: string;
  status: string;
  startcount: number;

  constructor(private statusUpdateService: StatusUpdateService,
              private wss: WebsocketService,
              private tableService: TableService) {

    this.setStartCount();

    this.statusUpdateService.updateStatusSubject.subscribe(value => {
      if (value) {
        this.statusBoxVisible = 'hidden';
      } else {
        this.statusBoxVisible = 'visible';
        this.startBox();
      }
    });
    this.statusUpdateService.hideStatus();
    this.status = 'Waiting for players to join:';
  }

  setStartCount(){
    this.startcount = 31;
    if (!environment.production) {
      this.startcount = 2;
    }
  }

  startBox() {
    let that = this;
    let table = this.tableService.tableNum;
    let intv = setInterval(function () {
      that.startcount--;
      that.status = 'Waiting for more players to join: ' + that.startcount;
      if (that.startcount < 1) {
        that.setStartCount();
        that.statusBoxVisible = 'hidden';
        that.statusUpdateService.tablePlaying = true;
        that.wss.emit('tablePlaying', {table: table});
        clearInterval(intv);
      }
    }, 1000);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    //console.log('destroyed');
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
