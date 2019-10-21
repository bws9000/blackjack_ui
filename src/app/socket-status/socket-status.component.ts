import { Component, OnInit } from '@angular/core';
import { SocketConnectService } from '../socket-connect.service';

@Component({
  selector: 'app-socket-status',
  templateUrl: './socket-status.component.html',
  styleUrls: ['./socket-status.component.css'],
  providers: [SocketConnectService],
})

export class SocketStatusComponent implements OnInit {
  private socket;
  public socket_status = false;
  constructor(socketConnectService: SocketConnectService) {
    this.socket = socketConnectService.getSocket();
  }
  ngOnInit() {
    let that = this;
    this.socket.on('connect', function () {
      this.emit('authentication', { devuser: 'bws9000' });
      this.on('authenticated', function () {
        if (this.connected) {
          that.socket_status = true;
        }
      });
    });
  }

}
