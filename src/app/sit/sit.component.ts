import {Component, Input, OnInit} from '@angular/core';
import {SeatService} from "../seat.service";
import {WebsocketService} from "../websocket.service";

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
  localSocket:string;

  constructor(private wss: WebsocketService,
                    private seatService: SeatService) {

    this.isHidden = true;
    this.opHidden = true;
    this.sitOrLeaveText = 'SIT DOWN';
    this.sitOrLeave = false;
    this.localSocket = this.wss.socketId;


    this.playerSeats().then(r =>{
      //do something ?
    });

    this.standup().then(r => {
      //do something ?
    });

    this.sitdown().then(r => {
      //do something ?
    })


  }

  async playerSeats(){
    this.seatService.playerSeats.subscribe(value => {
      let s = [];
      for (let i = 0; i < value.length; i++) {
        s.push(value[i][0]);
      }
      this.seated = s;
    });
  }

  async sitdown(){
    this.seatService.sitState.subscribe(v => {

      let j = JSON.stringify(v);
      let o = JSON.parse(j);
      let seat = o.sitting;
      let broadcast = o.broadcast;

      if (!broadcast) {
        this.isHidden = seat != this.id;

      } else {
        if (seat == this.id) {
          this.isHidden = true;
          this.opHidden = false;
        }
      }
    });
  }

  async standup(){
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
      this.wss.emit('sitTableOne', {player: this.id});
      if (!this.sitOrLeave) {
        this.sitOrLeaveText = 'STAND UP';
        this.sitOrLeave = true;
      }
    } else {
      this.wss.emit('standUpTableOne', {player: this.id});
      this.sitOrLeaveText = 'SIT DOWN';
      this.sitOrLeave = false;
    }
  }

  ngOnInit() {

    this.logStuff('>' + this.seat);
    this.id = this.seat;
    this.isHidden = false;

    let currentSeats = this.seatService.getInitState();
    if (currentSeats.length > 0) {
      for(let i=0;i<currentSeats.length;i++){
        if(this.id == currentSeats[i]){
          //this.isHidden = true;
          //this.opHidden = false;
        }
      }
    }

    /*
    switch (this.seat) {
      case "0":
        this.logStuff('Seat ' + this.seat + ' Ready');
        break;
      case "1":
        this.logStuff('Seat ' + this.seat + ' Ready');
        break;
      case "2":
        this.logStuff('Seat ' + this.seat + ' Ready');
        break;
      case "3":
        this.logStuff('Seat ' + this.seat + ' Ready');
        break;
      case "4":
        this.logStuff('Seat ' + this.seat + ' Ready');
        break;
      default:
        break;
    }
    */

  }

  logStuff(stuff) {
    console.log(stuff);
  }

}
