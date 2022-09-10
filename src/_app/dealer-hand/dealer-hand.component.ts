import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HandService} from "../services/hand.service";

@Component({
  selector: 'app-dealer-hand',
  templateUrl: './dealer-hand.component.html',
  styleUrls: ['./dealer-hand.component.css']
})
export class DealerHandComponent implements OnInit {

  cards: number[] = new Array<number>();

  constructor(private handService: HandService) {

    this.handService.allDealerHand.subscribe(value => {
      if (value !== null) {
        this.cards = value[0].hand;
      }
    });

    this.handService.dealerHandDeal.subscribe(value => {
      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      if (this.cards === null) {
        this.cards = new Array<number>();
      }
      if (this.cards !== null) {
        //this.cards.push(o.card.h);
       if(this.cards.length === 0){
         this.cards.push(98);
       }else{
         this.cards.push(o.card.h);
       }
      }
    });

    this.handService.dealerHand.subscribe(value => {
      if (value !== null) {
        this.cards = [98, value[0].hand[1]];
      }
    });

    this.handService.showDealerHand.subscribe(value => {
      if (value !== null) {
        this.cards = [value[0].hand[0], value[0].hand[1]];
      }
    });

    this.handService.hideDealerHand.subscribe(value => {
      //set in sit component
      if (!value) {
        this.cards = null;
      }
    });

    this.handService.clearDealerHandSubject.subscribe(value => {
      if (value) {
        this.cards = null;
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
