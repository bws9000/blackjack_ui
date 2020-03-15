import {Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HandService} from "../services/hand.service";

@Component({
  selector: 'app-dealer-hand',
  templateUrl: './dealer-hand.component.html',
  styleUrls: ['./dealer-hand.component.css']
})
export class DealerHandComponent implements OnInit {

  cards: [number, number];

  constructor(private handService: HandService) {

    this.handService.dealerHand.subscribe(value => {
      if (value !== null) {
        this.cards = [98, value[0].hand[1]];
      }
    });

    this.handService.showDealerHand.subscribe(value =>{
      if (value !== null) {
        this.cards = [value[0].hand[0], value[0].hand[1]];
      }
    });

    this.handService.hideDealerHand.subscribe(value=>{
      //set in sit component
      if(!value){
        this.cards = [99,99];
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
