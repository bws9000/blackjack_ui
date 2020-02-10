import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashStatusServiceService {

  statusMessage: Subject<Object> = new Subject<Object>();


  constructor() {

  }

  activate(result,seat,tableName){
    let data = {
      result:result,
      seat:seat,
      tableName:tableName
    };
    this.statusMessage.next(data);
  }

}
