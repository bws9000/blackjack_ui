import {Component, Input, OnInit} from '@angular/core';
import {SeatService} from "../services/seat.service";
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";
import {StatusUpdateService} from "../services/status-update.service";
import {PlayerboxService} from "../services/playerbox.service";
import {HandService} from "../services/hand.service";

@Component({
  selector: 'app-sit',
  templateUrl: './sit.component.html',
  styleUrls: ['./sit.component.css']
})
export class SitComponent implements OnInit {

  @Input() seat: string;
  sitOrLeaveText: string;
  sitOrLeave: boolean;
  isHidden: boolean;
  opHidden: boolean;
  id: string;
  seated: string[];
  localSocket: string;
  table: number;

  constructor(private wss: WebsocketService,
              private seatService: SeatService,
              private tableService: TableService,
              private playerboxService: PlayerboxService,
              private statusUpdateService: StatusUpdateService,
              private handService: HandService) {

    this.isHidden = true;
    this.opHidden = true;
    this.sitOrLeaveText = 'SIT DOWN';
    this.sitOrLeave = false;
    this.localSocket = this.wss.socketId;
    this.table = tableService.tableNum;

    this.seatService.playerStand.subscribe(value => {
      //this.logStuff('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      //this.logStuff('this.id: ' + this.id);
      //this.logStuff('value: ' + value);
      //this.logStuff('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      if (+this.id == value) {
        this.sitOrLeave = true;
        this.sitStand();
      }
    });


    this.seatService.reset.subscribe(value => {
      if (this.id === value) {
        this.sitOrLeaveText = 'SIT DOWN';
        this.sitOrLeave = false;
      }
    });

    this.seatService.playerSeats.subscribe(value => {
      let sid = [];
      let seatNum = [];
      for (let i = 0; i < value.length; i++) {
        sid.push(value[i][0]);
        seatNum.push(value[i][1]);
      }
      this.seated = sid; //socketid
      if (!seatNum.length) {
        this.opHidden = true;
        this.isHidden = false;
      }
      for (let i = 0; i < seatNum.length; i++) {
        if (this.opHidden == false) {
          if (!seatNum.includes(this.id)) {
            this.opHidden = true;
            if (!this.seated.includes(this.localSocket)) { //table/socket where sitting
              this.isHidden = false;
            }
          }
        }
      }

      //set "global" seatNum
      this.statusUpdateService.currentSeatedPlayers = seatNum.length;
    });


    this.seatService.sitState.subscribe(v => {

      let j = JSON.stringify(v);
      let o = JSON.parse(j);
      let seat = o.sitting;
      let broadcast = JSON.parse(o.broadcast);

      if (!broadcast) {
        if (seat != this.id) {
          this.isHidden = true;
        }
      } else {
        if (seat == this.id) {
          this.isHidden = true;
          this.opHidden = false;
        }
      }
    });

    this.seatService.standState.subscribe(v => {

      let j = JSON.stringify(v);
      let o = JSON.parse(j);
      let seat = o.sitting;
      let broadcast = o.broadcast;

      if (!broadcast) {
        if (this.id != seat && this.opHidden) {
          this.isHidden = false;
        }
      } else {
        if (this.id == seat) {
          if (this.seated.includes(this.localSocket)) { //table/socket where sitting
            this.opHidden = true;
          } else {
            this.opHidden = true;
            this.isHidden = false;
          }
        }
      }

    });

  }

  sitStand() {

    if (!this.sitOrLeave) {
      this.wss.emit('sitTable', {
        player: this.id,
        tableNum: this.table
      });
      if (!this.sitOrLeave) {
        this.sitOrLeaveText = 'STAND UP';
        this.seatService.sitting = true;
        this.sitOrLeave = true;
      }
    } else {
      this.wss.emit('standUpTable', {
        player: this.id,
        tableNum: this.table
      });
      this.sitOrLeaveText = 'SIT DOWN';
      this.seatService.sitting = false;
      this.sitOrLeave = false;
    }

  }

  ngOnInit() {

    this.id = this.seat;
    this.isHidden = false;

    let currentSeats = this.seatService.getInitState();

    if (currentSeats.length >= 0) {
      for (let i = 0; i < currentSeats.length; i++) {
        if (this.id == currentSeats[i]) {
          this.isHidden = true;
          this.opHidden = false;
        }
      }
    }

  }

  logStuff(stuff) {
    console.log(stuff);
  }

}
