import {Card2} from "./Card2";

export class WinLosePush {

  pResult:string;
  dResult:string;

  constructor(pArray: Array<any>, dArray: Array<any>,
              playerStatus: any, dealerStatus: any) {

    let ps = playerStatus;
    let ds = dealerStatus;

    if(ps === 'playing'){
      console.log('---psArray:'+pArray);
      ps = this.setHandStatus(pArray);
    }
    if(ds === 'playing'){
      console.log('---dsArray:'+dArray);
      ds = this.setHandStatus(dArray);
    }

    console.log('+++:p:'+ps);
    console.log('+++:d:'+ds);

    this.bothNumbers(ps,ds);
    this.playerNumber(ps,ds);
    this.dealerNumber(ps,ds);
    this.bothStrings(ps,ds);
  }

  getDealerResult(){
    return this.dResult;
  }
  getPlayerResult(){
    return this.pResult;
  }

  bothStrings(p,d){
    if(isNaN(p) && isNaN(d)){
      if(d === p){
        if(p === 'blackjack'){
          this.pResult = 'push';
          this.dResult = 'push';
        }else{
          this.pResult = 'busted';
          this.dResult = 'busted';
        }
      }
    }
  }

  playerNumber(p,d){
    if(!isNaN(p) && isNaN(d)){
      if(d === 'blackjack'){
        this.pResult = 'lose';
        this.dResult = 'win';
      }else if(d === 'busted'){
        this.pResult = 'win';
        this.dResult = 'lose';
      }
    }
  }

  dealerNumber(p,d){
    if(isNaN(p) && !isNaN(d)){
      if(p === 'blackjack'){
        this.pResult = 'win';
        this.dResult = 'lose';
      }else if(p === 'busted'){
        this.pResult = 'lose';
        this.dResult = 'win';
      }
    }
  }

  bothNumbers(p,d) {
    if (!isNaN(p) && !isNaN(d)) {
      if(p < d){
        this.pResult = 'lose';
        this.dResult = 'win';
      }else if(p > d){
        this.pResult = 'win';
        this.dResult = 'lose';
      }else{
        this.pResult = 'push';
        this.dResult = 'push';
      }
    }
  }

  setHandStatus(cardIndexArray) {
    let result = 0;
    let cardArray = [];
    let aceCount = 0;

    for (let i = 0; i < cardIndexArray.length; i++) {
      cardArray[i] = new Card2(cardIndexArray[i], "", "");
    }
    for (let i = 0; i < cardArray.length; i++) {
      let c = cardArray[i];
      result += c.value;
      if (c.name === 'ace') {
        aceCount++;
      }
    }
    //aces
    if (aceCount >= 1) {
      for (let i = 0; i < aceCount; i++) {
        if (result <= 11) {
          result = result + (10 - 1);
        }
      }
    }
    return result;
  }
}
