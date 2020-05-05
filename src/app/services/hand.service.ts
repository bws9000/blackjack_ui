import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {SeatService} from "./seat.service";

@Injectable({
  providedIn: 'root'
})

export class HandService {
  cardCount:number;
  shuffleCount:number;
  playerHands: Subject<Array<any>> = new Subject<Array<any>>();
  dealerHand: Subject<Array<any>> = new Subject<Array<any>>();
  allDealerHand: Subject<Array<any>> = new Subject<Array<any>>();
  hideDealerHand: Subject<boolean> = new Subject<boolean>();
  showDealerHand: Subject<Array<any>> = new Subject<Array<any>>();
  standUp: Subject<number> = new Subject<number>();

  clearPlayerHandsSubject: Subject<boolean> = new Subject<boolean>();
  clearDealerHandSubject: Subject<boolean> = new Subject<boolean>();

  public handResult: string;
  public handPlayed: boolean;

  public lastPlayerHand = [];

  //deal cards
  playerHandsDeal: Subject<Array<any>> = new Subject<Array<any>>();
  dealerHandDeal: Subject<Array<any>> = new Subject<Array<any>>();

  constructor(private seatService:SeatService) {
    this.cardCount = 0;
    this.handResult = 'playing';
    this.handPlayed = false;
  }

  getCardCount(){
    return this.cardCount;
  }
  setCardCount(cardCount){
    if(this.seatService.currentSeats > 0) {
      if (cardCount !== undefined) {
        this.cardCount = cardCount;
      }
    }
  }
  getShuffleCount(){
    return this.shuffleCount;
  }
  setShuffleCount(shuffleCount){
    if(this.seatService.currentSeats > 0) {
      if (shuffleCount !== undefined) {
        this.shuffleCount = shuffleCount;
      }
    }
  }

  getDealerHandDeal(dealerHandDeal){
    this.dealerHandDeal.next(dealerHandDeal);
  }

  getPlayerHandsDeal(playerHandsDeal){
    this.playerHandsDeal.next(playerHandsDeal);
  }

  clearDealerHand() {
    this.clearDealerHandSubject.next(true);
  }

  clearPlayerHands() {
    this.clearPlayerHandsSubject.next(true);
  }

  seatStand(seat) {
    this.standUp.next(seat);
  }

  dealerHandVisible(status) {
    this.hideDealerHand.next(status);
  }

  getPlayerHands(playerHands) {
    //this.logStuff(JSON.stringify(playerHands));
    this.playerHands.next(playerHands);
  }

  getDealerHand(dealerHand) {
    //this.logStuff(JSON.stringify(dealerHand));
    this.dealerHand.next(dealerHand);
  }

  showAllDealerHand(dealerHand) {
    this.allDealerHand.next(dealerHand);
  }

  showDealerHiddenCard(dealerHand) {
    this.showDealerHand.next(dealerHand);
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
