import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {StatusUpdateService} from "./status-update.service";
import {isBoolean} from "util";

@Injectable({
  providedIn: 'root'
})

export class HandService {

  playerHands: Subject<Array<any>> = new Subject<Array<any>>();
  dealerHand: Subject<Array<any>> = new Subject<Array<any>>();
  hideDealerHand: Subject<boolean> = new Subject<boolean>();
  standUp: Subject<number> = new Subject<number>();

  constructor() { }

  seatStand(seat){
    this.standUp.next(seat);
  }

  dealerHandVisible(status){
    this.hideDealerHand.next(status);
  }

  getPlayerHands(playerHands){
    this.logStuff(JSON.stringify(playerHands));
    this.playerHands.next(playerHands);
  }

  getDealerHand(dealerHand){
    this.logStuff(JSON.stringify(dealerHand));
    this.dealerHand.next(dealerHand);
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
