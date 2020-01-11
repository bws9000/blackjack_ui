import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerboxService {

  playerSeats: Subject<Array<any>> = new Subject<Array<any>>();

  constructor() { }

  seats(playerSeats){
    let ps = JSON.parse(playerSeats);
    this.playerSeats.next(ps);
  }
}
