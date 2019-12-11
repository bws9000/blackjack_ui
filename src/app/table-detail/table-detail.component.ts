import { Component, OnInit } from '@angular/core';
import {WebsocketService} from "../websocket.service";

@Component({
  selector: 'app-table-detail',
  templateUrl: './table-detail.component.html',
  styleUrls: ['./table-detail.component.css']
})
export class TableDetailComponent implements OnInit {

  constructor(private wss:WebsocketService) {

  }

  leaveTable(){
    this.wss.emit('leaveTableOne',{left:'tableone'});
  }

  ngOnInit() {
  }

}
