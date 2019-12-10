import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Table from "../Table";
import {WebsocketService} from "../websocket.service";

@Component({
  selector: 'app-table-select',
  templateUrl: './table-select.component.html',
  styleUrls: ['./table-select.component.css']
})
export class TableSelectComponent implements OnInit {

  tables: Table;

  constructor(private http: HttpClient,
              private wss: WebsocketService) {
    let that = this;
    setTimeout(function () {
      //that.tables = Table.fromJSON(tempTables);
      //console.log(that.tables);
    }, 9000);
  }

  joinRoomOne() {
    this.wss.emit('joinTableOne', {room: 1});
  }
  joinRoomTwo() {
    this.wss.emit('joinTableTwo', {room: 2});
  }
  joinRoomThree(){
    this.wss.emit('joinTableThree',{room: 3});
  }

  ngOnInit() {
  }

}
