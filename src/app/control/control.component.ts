import {Component, OnDestroy, OnInit} from '@angular/core';
import {StatusUpdateService} from "../status-update.service";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit, OnDestroy {

  statusBoxVisible: string;
  status: string;
  startcount: number;

  constructor(private socketUpdateService: StatusUpdateService) {

    this.startcount = 11;
    this.socketUpdateService.updateStatusSubject.subscribe(value => {
      if (value) {
        this.statusBoxVisible = 'hidden';
      } else {
        this.statusBoxVisible = 'visible';
        this.startBox();
      }
    });
    this.socketUpdateService.hideStatus();
    this.status = 'Waiting for players to join:';
  }

  startBox() {
    let that = this;
    let intv = setInterval(function () {
      that.startcount--;
      that.status = 'Waiting for players to join: ' + that.startcount;
      if (that.startcount < 1) {
        that.startcount = 11;
        that.statusBoxVisible = 'hidden';
        clearInterval(intv);
      }
    }, 1000);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    //console.log('destroyed');
  }

}
