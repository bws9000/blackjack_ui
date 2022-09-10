export class Card2 {

  socketid: string;
  table: string;
  name: string;
  suit: string;
  value: number;

  constructor(index,socketid,table) {
    this.socketid = socketid;
    this.table = table;
    this.name = '';
    this.suit = '';
    this.value = 0;
    this.setCard(index);
  }

  setCard(index: number) {
    switch (index) {
      case 0:
        this.name = 'ace';
        this.suit = 'diamonds';
        this.value = 1;
        break;
      case 1:
        this.name = 'ace';
        this.suit = 'spades';
        this.value = 1;
        break;
      case 2:
        this.name = 'ace';
        this.suit = 'hearts';
        this.value = 1;
        break;
      case 3:
        this.name = 'ace';
        this.suit = 'clubs';
        this.value = 1;
        break;
      case 4:
        this.name = '2';
        this.suit = 'diamonds';
        this.value = 2;
        break;
      case 5:
        this.name = '2';
        this.suit = 'spades';
        this.value = 2;
        break;
      case 6:
        this.name = '2';
        this.suit = 'hearts';
        this.value = 2;
        break;
      case 7:
        this.name = '2';
        this.suit = 'clubs';
        this.value = 2;
        break;
      case 8:
        this.name = '3';
        this.suit = 'diamonds';
        this.value = 3;
        break;
      case 9:
        this.name = '3';
        this.suit = 'spades';
        this.value = 3;
        break;
      case 10:
        this.name = '3';
        this.suit = 'hearts';
        this.value = 3;
        break;
      case 11:
        this.name = '3';
        this.suit = 'clubs';
        this.value = 3;
        break;
      case 12:
        this.name = '4';
        this.suit = 'diamonds';
        this.value = 4;
        break;
      case 13:
        this.name = '4';
        this.suit = 'spades';
        this.value = 4;
        break;
      case 14:
        this.name = '4';
        this.suit = 'hearts';
        this.value = 4;
        break;
      case 15:
        this.name = '4';
        this.suit = 'clubs';
        this.value = 4;
        break;
      case 16:
        this.name = '5';
        this.suit = 'diamonds';
        this.value = 5;
        break;
      case 17:
        this.name = '5';
        this.suit = 'spades';
        this.value = 5;
        break;
      case 18:
        this.name = '5';
        this.suit = 'hearts';
        this.value = 5;
        break;
      case 19:
        this.name = '5';
        this.suit = 'clubs';
        this.value = 5;
        break;
      case 20:
        this.name = '6';
        this.suit = 'diamonds';
        this.value = 6;
        break;
      case 21:
        this.name = '6';
        this.suit = 'spades';
        this.value = 6;
        break;
      case 22:
        this.name = '6';
        this.suit = 'hearts';
        this.value = 6;
        break;
      case 23:
        this.name = '6';
        this.suit = 'clubs';
        this.value = 6;
        break;
      case 24:
        this.name = '7';
        this.suit = 'diamonds';
        this.value = 7;
        break;
      case 25:
        this.name = '7';
        this.suit = 'spades';
        this.value = 7;
        break;
      case 26:
        this.name = '7';
        this.suit = 'hearts';
        this.value = 7;
        break;
      case 27:
        this.name = '7';
        this.suit = 'clubs';
        this.value = 7;
        break;
      case 28:
        this.name = '8';
        this.suit = 'diamonds';
        this.value = 8;
        break;
      case 29:
        this.name = '8';
        this.suit = 'spades';
        this.value = 8;
        break;
      case 30:
        this.name = '8';
        this.suit = 'hearts';
        this.value = 8;
        break;
      case 31:
        this.name = '8';
        this.suit = 'clubs';
        this.value = 8;
        break;
      case 32:
        this.name = '9';
        this.suit = 'diamonds';
        this.value = 9;
        break;
      case 33:
        this.name = '9';
        this.suit = 'spades';
        this.value = 9;
        break;
      case 34:
        this.name = '9';
        this.suit = 'hearts';
        this.value = 9;
        break;
      case 35:
        this.name = '9';
        this.suit = 'clubs';
        this.value = 9;
        break;
      case 36:
        this.name = '10';
        this.suit = 'diamonds';
        this.value = 10;
        break;
      case 37:
        this.name = '10';
        this.suit = 'spades';
        this.value = 10;
        break;
      case 38:
        this.name = '10';
        this.suit = 'hearts';
        this.value = 10;
        break;
      case 39:
        this.name = '10';
        this.suit = 'clubs';
        this.value = 10;
        break;
      case 40:
        this.name = 'jack';
        this.suit = 'diamonds';
        this.value = 10;
        break;
      case 41:
        this.name = 'jack';
        this.suit = 'spades';
        this.value = 10;
        break;
      case 42:
        this.name = 'jack';
        this.suit = 'hearts';
        this.value = 10;
        break;
      case 43:
        this.name = 'jack';
        this.suit = 'clubs';
        this.value = 10;
        break;
      case 44:
        this.name = 'queen';
        this.suit = 'diamonds';
        this.value = 10;
        break;
      case 45:
        this.name = 'queen';
        this.suit = 'spades';
        this.value = 10;
        break;
      case 46:
        this.name = 'queen';
        this.suit = 'hearts';
        this.value = 10;
        break;
      case 47:
        this.name = 'queen';
        this.suit = 'clubs';
        this.value = 10;
        break;
      case 48:
        this.name = 'king';
        this.suit = 'diamonds';
        this.value = 10;
        break;
      case 49:
        this.name = 'king';
        this.suit = 'spades';
        this.value = 10;
        break;
      case 50:
        this.name = 'king';
        this.suit = 'hearts';
        this.value = 10;
        break;
      case 51:
        this.name = 'king';
        this.suit = 'clubs';
        this.value = 10;
        break;
      default:
        break;
    }
  }
}
