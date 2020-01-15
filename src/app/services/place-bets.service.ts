import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlaceBetsService {

  placeBetsStatus: Subject<boolean>= new Subject<boolean>();
  playerBanks: Subject<Array<any>> = new Subject<Array<any>>();

  constructor() {

  }

  setStatus(value){
    this.placeBetsStatus.next(value);
  }

  updateBanks(playerBanks) {
    this.playerBanks.next(playerBanks);
  }

}
