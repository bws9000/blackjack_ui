import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../services/websocket.service";
import {ControlService} from "../services/control.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-game-home',
  templateUrl: './game-home.component.html',
  styleUrls: ['./game-home.component.css']
})
export class GameHomeComponent implements OnInit {

  constructor(private router: Router,
              private wss: WebsocketService,
              private control:ControlService) {

    //this.wss.startChange.next(true);

    ////////////////////////////////
    this.control.gamePosition = 0;//
    ////////////////////////////////

    /*
    this.wss.emit('blank', {
      process:'tablesInfo'
    });
    */

  }

  // getAllTablesEmit(data) {
  //   this.wss.startChange.next(true);
  //   this.logStuff('getAllTablesEmit() ' + JSON.stringify(data));
  // }
  //
  // openBetDashEmit(data) {
  //   this.logStuff('openBetDash(): ' + JSON.stringify(data));
  //   this.wss.startChange.next(true);
  // }

  ngOnInit() {

    // if(this.wss.start) {
    //   this.wss
    //     .onEvent('getAllTablesEmit')
    //     .subscribe(data => this.getAllTablesEmit(data));
    //
    //   this.wss
    //     .onEvent('openBetDashEmit')
    //     .subscribe(data => this.openBetDashEmit(data));
    // }
  }

  joinTable() {
    this.router.navigate(['/tables']).then(r => {
      //
    });
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      this.logStuff('*** GAME HOME COMPONENT ***');
      console.log(stuff);
      this.logStuff('***************************');
    }
  }

}
