import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerDashService {

  visible: Subject<boolean> = new Subject<boolean>();

  constructor() {
  }

  updateVisible(value){
    this.visible.next(value);
  }
}
