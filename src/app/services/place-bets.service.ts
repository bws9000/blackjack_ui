import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlaceBetsService {

  placeBetsStatus: Subject<Object>= new Subject<Object>();
  playerBanks: Subject<Array<any>> = new Subject<Array<any>>();
  visible: Subject<boolean> = new Subject<boolean>();

  public currentBank:number;
  public currentBet:number;

  constructor() {
    this.currentBet = undefined;
    this.currentBank = undefined;
  }

  setVisible(value){
    this.visible.next(value);
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

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
