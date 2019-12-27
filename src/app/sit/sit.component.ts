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

  constructor(private wss: WebsocketService,
              private seatService: SeatService) {

    this.isHidden = true;
    this.opHidden = true;
    this.sitOrLeaveText = 'SIT DOWN';
    this.sitOrLeave = false;

    //for recievers
    this.seatService.sitButton.subscribe(v => {
      let j = JSON.stringify(v);
      let o = JSON.parse(j);
      let seat = o.seat;
      if (seat == this.id) {
        this.isHidden = true;
      }
    });

    this.seatService.standButton.subscribe(v => {
      let j = JSON.stringify(v);
      let o = JSON.parse(j);
      let seat = o.seat;
      if (seat == this.id) {
        this.isHidden = false;
        this.opHidden = true;
      }
    });

    this.seatService.playerSeats.subscribe(value => {
      let sid = this.wss.socketId;
      for (let i = 0; i < value.length; i++) {
        let socketid = value[i][0];
        let seat = value[i][1];
        if(this.id == seat && sid != socketid){
          this.isHidden = true;
          this.opHidden = false;
        }
      }
    });

    //for sender
    this.seatService.show.subscribe(v => {
      if (v !== this.id) {
        this.isHidden = false;
      }
    });

    this.seatService.hide.subscribe(v => {
      if (v !== this.id) {
        this.isHidden = true;
      }
    });
  }

  sitStand(doEmit) {
    if (!this.sitOrLeave) {
      if (doEmit) {
        this.wss.emit('sitTableOne', {player: this.id});
        this.hideTheRest(this.id);
      }
      this.sitOrLeaveText = 'STAND UP';
      this.sitOrLeave = true;
    } else {
      if (doEmit) {
        this.wss.emit('standUpTableOne', {player: this.id});
        this.showTheRest(this.id);
      }
      this.sitOrLeaveText = 'SIT DOWN';
      this.sitOrLeave = false;
    }
  }

  hideTheRest(id) {
    this.seatService.hideSeats(id);
  }

  showTheRest(id) {
    this.seatService.showSeats(id);
  }

  ngOnInit() {

    this.logStuff('>' + this.seat);
    this.id = this.seat;
    this.isHidden = false;

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
