import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class MultiDashService {

  visible: Subject<Object> = new Subject<Object>();
  splitVisible: Subject<Object> = new Subject<Object>();

  constructor() {
  }

  updateVisible(visible, dealerResult, playerResults,
                dealerHandArray) {

    let data = {
      visible: visible,
      dealerResult: dealerResult,
      playerResults: playerResults,
      dHandArray: dealerHandArray,
    };
    this.visible.next(data);
  }

  updateSplitVisible(visible, sp1, sp2, dealerResult, dealerHandArray) {
    let data = {
      visible: visible,
      splitResult1:sp1,
      splitResult2:sp2,
      dealerResult: dealerResult,
      dHandArray: dealerHandArray,
    };
    this.splitVisible.next(data);
  }
}
