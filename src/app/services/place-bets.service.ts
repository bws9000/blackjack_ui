import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PlaceBetsService {

  placeBetsStatus: Subject<Object> = new Subject<Object>();
  playerBanks: Subject<Array<any>> = new Subject<Array<any>>();
  visible: Subject<Object> = new Subject<Object>();
  intv: number;

  public currentBank: number;
  public currentBet: number;

  public youCanSitNow: boolean;

  constructor() {
    this.currentBet = undefined;
    this.currentBank = undefined;
    this.youCanSitNow = true;
  }

  setVisible(value, seat) {
    let data = {
      value: value,
      seat: seat
    };
    this.visible.next(data);
  }

  setStatus(value, seat) {
    let data = {
      value: value,
      seat: seat
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
