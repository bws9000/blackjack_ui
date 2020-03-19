import { Component, OnInit } from '@angular/core';
import {MultiDashService} from "../services/multi-dash.service";
import {Observable, Subscription} from "rxjs";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-multi-dash',
  templateUrl: './multi-dash.component.html',
  styleUrls: ['./multi-dash.component.css']
})
export class MultiDashComponent implements OnInit {

  multiDashVisible: string;
  private openTime;
  private timer;
  private subTimer: Subscription;

  constructor(private mdService: MultiDashService) {
    this.openTime = 10;
    //this.logStuff('>>>: ' + this.openTime);
    this.multiDashVisible = 'hidden';
    this.mdService.visible.subscribe(value =>{

      let j = JSON.stringify(value);
      let o = JSON.parse(j);
      let visible = o.visible;//true
      let dealerResult = o.dealerResult;
      let playerResult = o.playerResult;
      let dHandArray = o.dHandArray;
      let pHandArray = o.pHandArray;

      this.logStuff('dResult: ' + dealerResult);
      this.logStuff('pResult: ' + playerResult);
      this.logStuff('dHandArray: ' + dHandArray);
      this.logStuff('pHandArray: ' + pHandArray);

      if(visible){
        this.multiDashVisible = 'visible';
        this.timer = Observable.timer(1000, 1000);
        this.subTimer = this.timer.subscribe(t => this.closeCount(t));
      }
    });
  }

  closeCount(t){
    this.openTime--;
    //this.logStuff('count: ' + this.openTime);
    if (this.openTime < 0) {
      this.openTime = 10;
      this.subTimer.unsubscribe();
      this.multiDashVisible = 'hidden';
      //start game over
    }
  }

  ngOnDestroy(): void {
    if(this.subTimer !== undefined) {
      this.subTimer.unsubscribe();
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

  ngOnInit() {
  }

}
