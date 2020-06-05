import {Injectable} from '@angular/core';
import {TableMap} from '../TableMap';
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class TableService {

  //tableArray: Subject<Array<Object>> = new Subject<Array<Object>>();
  tableArray: Array<Object> = new Array<Object>();
  tableArrayDisplay: Subject<boolean> = new Subject<boolean>();

  public tableNum: number;
  public tablePlaying: boolean;

  //public tables = new Map<String,Object>();
  //public maxTables = 10;

  constructor() {
    this.tablePlaying = false;
    this.tableNum = undefined;
  }

  resetTableArray(){
    this.tableArray = new Array<Object>();
  }

  displayTables(){
    this.tableArrayDisplay.next(true);
  }

  setTables(tables){
    //this.tableArray.next();
    this.tableArray = tables;
  }
  getTables(){
    return this.tableArray;
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }
}
