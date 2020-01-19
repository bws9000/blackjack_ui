import {Component, OnInit} from '@angular/core';
import {PlaceBetsService} from "../services/place-bets.service";
import {environment} from "../../environments/environment";
import {SeatService} from "../services/seat.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {WebsocketService} from "../services/websocket.service";
import {TableService} from "../services/table.service";


@Component({
  selector: 'app-place-bets',
  templateUrl: './place-bets.component.html',
  styleUrls: ['./place-bets.component.css']
})
export class PlaceBetsComponent implements OnInit {

  betInProgress: boolean;
  placeBetForm: FormGroup;
  placeBetsVisible: string;
  chips: number;
  currentBet: number;
  selectedValue: number;

  constructor(private placeBetsService: PlaceBetsService,
              private seatService: SeatService,
              private tableService: TableService,
              private wss: WebsocketService) {

    this.chips = this.placeBetsService.currentBank;

    this.selectedValue = 5;
    this.placeBetForm = new FormGroup({
      chips: new FormControl()
    });

    this.placeBetsVisible = 'hidden';

    this.placeBetsService.placeBetsStatus.subscribe(value => {

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let v = o.value;
      let s = o.seat;

      if(this.placeBetsService.currentBet === undefined) {
        if (this.seatService.currentSeat !== undefined) {
          if (v) {
            this.placeBetsVisible = 'hidden';
            this.betInProgress = false;
          } else {
            this.placeBetsVisible = 'visible';
            this.betInProgress = true;
          }
        }
      }


    });


    this.placeBetsService.playerBanks.subscribe(value => {
      let currentSeat = this.seatService.currentSeat;
      for (let i = 0; i < value.length; i++) {
        if (value[i].seat === currentSeat) {
          this.chips = value[i].chips;
        }
      }
    });
  }

  onSubmit() {
    this.currentBet = this.placeBetForm.get('chips').value;
    this.placeBetsService.currentBet = this.currentBet;
    this.placeBetsVisible = 'hidden';
    //let seat = this.seatService.currentSeat;
    //let status = 'player ' + this.seatService.currentSeat + ' bet ' + this.currentBet;
    let table = this.tableService.tableNum;
    this.wss.emit('nextPlayerBet',{table:table});
  }

  getChips() {
    return this.placeBetsService.currentBank;
  }

  ngOnInit() {

  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
