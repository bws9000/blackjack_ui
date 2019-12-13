import { Component, OnInit } from '@angular/core';
import {WebsocketService} from "../websocket.service";
import {environment} from "../../environments/environment";

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

  logStuff(stuff:any){
    if(!environment.production){
      console.log(stuff);
    }
  }

}
