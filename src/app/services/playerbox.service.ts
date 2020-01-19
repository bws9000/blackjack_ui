import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerboxService {

  playerSeats: Subject<Array<any>> = new Subject<Array<any>>();
  playerAction: Subject<string> = new Subject<string>();
  resetSubject: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  seats(playerSeats){
    let ps = JSON.parse(playerSeats);
    this.playerSeats.next(ps);
  }

  setAction(seat){
    this.playerAction.next(seat);
  }

  reset(){
    this.resetSubject.next(true);
  }

}
