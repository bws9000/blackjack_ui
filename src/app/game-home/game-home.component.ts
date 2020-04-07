import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../services/websocket.service";

@Component({
  selector: 'app-game-home',
  templateUrl: './game-home.component.html',
  styleUrls: ['./game-home.component.css']
})
export class GameHomeComponent implements OnInit {

  constructor(private router: Router,
              private wss: WebsocketService) {

    this.wss.emit('blank', {
      process:'tablesInfo'
    });
  }

  ngOnInit() {
  }

  joinTable() {
    this.router.navigate(['/tables']).then(r => {
      //
    });
  }

}
