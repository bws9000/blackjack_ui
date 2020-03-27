import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Table from "../Table";
import {WebsocketService} from "../services/websocket.service";
import {environment} from "../../environments/environment";
import {TableService} from "../services/table.service";
import {PlatformLocation} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-table-select',
  templateUrl: './table-select.component.html',
  styleUrls: ['./table-select.component.css']
})
export class TableSelectComponent implements OnInit, OnDestroy {

  tables: Table;

  constructor(private http: HttpClient,
              private wss: WebsocketService,
              private ts: TableService,
              private router: Router,
              private location: PlatformLocation,
              private route: ActivatedRoute) {

  }

  joinRoom(roomNum) {
    this.ts.tableNum = roomNum;
    this.wss.emit('joinTable', {room: roomNum});
  }

  createTable(){
    alert('Not Yet Available');
  }

  ngOnInit() {
    if (this.wss.start) {

    } else {
      this.router.navigate(['/']).then((r) => {
        //do something...
      })
    }
  }

  logStuff(stuff:any){
    if(!environment.production){
      console.log(stuff);
    }
  }

  ngOnDestroy(): void {
    //
  }

}
