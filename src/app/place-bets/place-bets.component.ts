import {Component, OnInit} from '@angular/core';
import {PlaceBetsService} from "../services/place-bets.service";
import {environment} from "../../environments/environment";
import {SeatService} from "../services/seat.service";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


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
  currentBet:number;
  selectedValue:number;

  constructor(private placeBetsService: PlaceBetsService,
              private seatService: SeatService,
              private formBuilder: FormBuilder) {

    this.chips = 0;
    this.currentBet = 0;
    this.selectedValue = 5;
    this.placeBetForm = new FormGroup({
      chips: new FormControl()
    });

    this.placeBetsService.placeBetsStatus.subscribe(value => {
      if (!value) {
        this.placeBetsVisible = 'hidden';
        this.betInProgress = false;
      } else {
        this.placeBetsVisible = 'visible';
        this.betInProgress = true;
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

  onSubmit(){
    this.currentBet = this.placeBetForm.get('chips').value;
    this.placeBetsService.currentBet = this.currentBet;
    this.placeBetsVisible = 'hidden';
  }

  ngOnInit() {

  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
