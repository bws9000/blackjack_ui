import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class MultiDashService {

  visible: Subject<Object> = new Subject<Object>();

  constructor() {
  }

  updateVisible(visible, dealerResult,playerResults,
                dealerHandArray){

    let data = {
      visible: visible,
      dealerResult: dealerResult,
      playerResults: playerResults,
      dHandArray: dealerHandArray,
    };
    this.visible.next(data);
  }
}
