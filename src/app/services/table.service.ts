import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TableService {

  public tableNum: number;
  public tablePlaying: boolean;
  public tableInstances;

  constructor() {
    this.tableInstances = new Array<string>();
    this.tablePlaying = false;
    this.tableNum = undefined;
  }

  setTableInstance(){
    let instanceId = this.setUnique();
    this.tableInstances.push(instanceId);
  }

  getTableInstances(){
    return this.tableInstances;
  }

  setUnique(){
    return this.randomId(6);
  }

  randomId(length) {
    let result = '';
    //let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


}
