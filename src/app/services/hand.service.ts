import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class HandService {

  playerHands: Subject<Array<any>> = new Subject<Array<any>>();

  constructor() { }

  getPlayerHands(playerHands){
    this.logStuff(JSON.stringify(playerHands));
    this.playerHands.next(playerHands);
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
