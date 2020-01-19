import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TableService {

  public tableNum: number;
  public tablePlaying: boolean;

  constructor() {
    this.tablePlaying = false;
    this.tableNum = undefined;
  }


}
