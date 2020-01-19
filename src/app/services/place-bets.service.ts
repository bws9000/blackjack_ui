import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlaceBetsService {

  placeBetsStatus: Subject<Object>= new Subject<Object>();
  playerBanks: Subject<Array<any>> = new Subject<Array<any>>();
  public currentBank:number;
  public currentBet:number;

  constructor() {
    this.currentBet = undefined;
    this.currentBank = undefined;
  }

  setStatus(value,seat){
    let data = {
      value:value,
      seat:seat
    };
    this.placeBetsStatus.next(data);
  }

  updateBanks(playerBanks) {
    this.playerBanks.next(playerBanks);
  }

}
