import {Component, OnInit} from '@angular/core';
import {PlaceBetsService} from "../services/place-bets.service";
import {environment} from "../../environments/environment";
import {SeatService} from "../services/seat.service";

@Component({
  selector: 'app-place-bets',
  templateUrl: './place-bets.component.html',
  styleUrls: ['./place-bets.component.css']
})
export class PlaceBetsComponent implements OnInit {

  placeBetsVisible: string;
  chips: number;

  constructor(private placeBetsService: PlaceBetsService,
              private seatService: SeatService) {

    this.chips = 0;

    this.placeBetsService.placeBetsStatus.subscribe(value => {
      if (!value) {
        this.placeBetsVisible = 'hidden';
      } else {
        this.placeBetsVisible = 'visible';
      }
    });
    this.placeBetsService.setStatus(false);


    this.placeBetsService.playerBanks.subscribe(value => {
      let currentSeat = this.seatService.currentSeat;
      for(let i=0;i<value.length;i++){
        if(value[i].seat === currentSeat){
          this.chips = value[i].chips;
        }
      }
    });
  }

  ngOnInit() {
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
