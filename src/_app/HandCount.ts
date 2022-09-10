import {Card2} from "./Card2";

//blackjack
export class HandCount{

  constructor() {}

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
