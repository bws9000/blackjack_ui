import {Component, Input, OnInit} from '@angular/core';
import {PlayerDashService} from "../services/player-dash.service";
import {SeatService} from "../services/seat.service";
import {HandService} from "../services/hand.service";
import {ActivatedRoute} from "@angular/router";
import {TableService} from "../services/table.service";
import {DashStatusServiceService} from "../services/dash-status-service.service";
import {WebsocketService} from "../services/websocket.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-split-dash',
  templateUrl: './split-dash.component.html',
  styleUrls: ['../player-dash/player-dash.component.css'] // <---------- !!!
})
export class SplitDashComponent implements OnInit {

  @Input() dash: string;

  splitCards1: [number];
  splitCards2: [number];

  private dashId;
  dcards: [number, number];
  splitDashVisible: string;
  seat: string;
  tableName: string;
  statusBoxVisible: string;
  playerStatus: string;
  actionTimerCount: number;
  private broadcast;
  private dashTimer;
  private dashSubTimer: Subscription;
  private dashTimer2;
  private dashSubTimer2: Subscription;
  timer2time: number;
  userSubscription: Subscription;

  constructor(private playerDashService: PlayerDashService,
              private seatService: SeatService,
              private handService: HandService,
              private route: ActivatedRoute,
              private tableService: TableService,
              private dss: DashStatusServiceService,
              private wss: WebsocketService) {

    this.playerStatus = 'playing';
    this.statusBoxVisible = 'hidden';
    this.splitDashVisible = 'hidden';

  }

  split(){

  }

  standClick(){

  }

  hit(){

  }

  ngOnInit() {
  }

}
