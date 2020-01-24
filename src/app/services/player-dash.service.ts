import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class PlayerDashService {

  visible: Subject<Object> = new Subject<Object>();

  constructor() {
  }

  updateVisible(value,seat){
    let data = {
      value:value,
      seat:seat
    };
    this.visible.next(data);
  }
}
