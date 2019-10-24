import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketConnectService } from '../socket-connect.service';

@Component({
  selector: 'app-socket-status',
  templateUrl: './socket-status.component.html',
  styleUrls: ['./socket-status.component.css'],
  providers: [SocketConnectService],
})

export class SocketStatusComponent implements OnInit {
  public socket_status;
  constructor(private socketConnectService: SocketConnectService) { }
  ngOnInit() {
    /*
    this.socketConnectService.authConnect().then(value => {
      this.socket_status = value;
      this.getInitInfo();
    });
    */
  }
  getInitInfo() {
    this.socketConnectService.getInitInfo().subscribe(res => {
      if (res) {
        console.log(res);
      } else {
        err => console.error(err);
      }
    });
  }
}