import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class MultiDashService {

  visible: Subject<Object> = new Subject<Object>();

  constructor() {
  }

  updateVisible(visible, dealerResult,playerResult,
                dealerHandArray, playerHandArray){
    let data = {
      visible: visible,
      dealerResult: dealerResult,
      playerResult: playerResult,
      dHandArray: dealerHandArray,
      pHandArray: playerHandArray
    };
    this.visible.next(data);
  }
}
