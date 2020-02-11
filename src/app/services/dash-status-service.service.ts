import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashStatusServiceService {

  statusMessage: Subject<Object> = new Subject<Object>();


  constructor() {

  }

  activate(result,seat,tableName,nextPlayer,broadcast){
    let data = {
      result:result,
      seat:seat,
      tableName:tableName,
      nextPlayer:nextPlayer,
      broadcast:broadcast
    };
    this.statusMessage.next(data);
  }

}
