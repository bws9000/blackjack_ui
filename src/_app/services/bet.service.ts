import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BetService {

  public playerBet:boolean;

  constructor() {
    this.playerBet = false;
  }
}
