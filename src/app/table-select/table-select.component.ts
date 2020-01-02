import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Table from "../Table";
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";
import {TableService} from "../table.service";

@Component({
  selector: 'app-table-select',
  templateUrl: './table-select.component.html',
  styleUrls: ['./table-select.component.css']
})
export class TableSelectComponent implements OnInit {

  tables: Table;

  constructor(private http: HttpClient,
              private wss: WebsocketService,
              private ts: TableService) {
  }

  joinRoom(roomNum) {
    this.ts.tableNum = roomNum;
    this.wss.emit('joinTable', {room: roomNum});
  }

  createTable(){
    alert('Not Yet Available');
  }

  ngOnInit() {
  }

  logStuff(stuff:any){
    if(!environment.production){
      console.log(stuff);
    }
  }

}
