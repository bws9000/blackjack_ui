import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../services/websocket.service";
import {ControlService} from "../services/control.service";

@Component({
  selector: 'app-game-home',
  templateUrl: './game-home.component.html',
  styleUrls: ['./game-home.component.css']
})
export class GameHomeComponent implements OnInit {

  constructor(private router: Router,
              private wss: WebsocketService,
              private control:ControlService) {

    ////////////////////////////////
    this.control.gamePosition = 0;//
    ////////////////////////////////

    /*
    this.wss.emit('blank', {
      process:'tablesInfo'
    });
    */

  }

  ngOnInit() {
  }

  joinTable() {
    this.router.navigate(['/tables']).then(r => {
      //
    });
  }

}
