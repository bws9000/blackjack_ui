import {Component, OnInit} from '@angular/core';
import {PlayerDashService} from "../services/player-dash.service";

@Component({
  selector: 'app-player-dash',
  templateUrl: './player-dash.component.html',
  styleUrls: ['./player-dash.component.css']
})
export class PlayerDashComponent implements OnInit {

  playerDashVisible: string;

  constructor(private playerDashService: PlayerDashService) {
    this.playerDashVisible = 'hidden';

    this.playerDashService.visible.subscribe(value=>{
      if(value){
        this.show();
      }else {
        this.hide();
      }
    });

  }

  hide() {
    this.playerDashVisible = 'hidden';
  }
  show(){
    this.playerDashVisible = 'visible';
  }

  ngOnInit() {
  }

}
