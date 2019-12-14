import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

import {
  NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import {WebsocketService} from "./websocket.service";
import {environment} from "../environments/environment";
import {SocketConnectComponent} from "./socket-connect/socket-connect.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  loadingWheelVisible: string;

  constructor(private loadingBar: SlimLoadingBarService,
              private wss: WebsocketService,
              private router: Router) {

    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });

    this.wss.startChange.subscribe(value => {
      this.logStuff('wheel state change: ' + value);
      if (value) {
        this.loadingWheelVisible = 'hidden';
      }else{
        this.loadingWheelVisible = 'visible';
      }
    });

  }

  ngAfterViewInit(): void {
    //this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
  }

  logEvent(data: any) {
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  ///////////////////////////////////////////////////////
  joinTableOne(data) {
    this.wss.startChange.next(true);
    this.router.navigate(['/tables/tableOne']);
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  leftTableOne(data) {
    this.wss.startChange.next(true);
    this.router.navigate(['/tables']);
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  ////////////////////////////////////////////////////////

  async ngOnInit(): Promise<void> {

    let that = this;
    this.wss.startChange.next(false);
    let result = await this.wss.authConnect();
    if (result) {
      this.wss.startChange.next(true);
      this.wss.initEvents();

      //initEmit
      this.wss
        .onEvent('initEmit')
        .subscribe(data => this.logEvent(data));

      //joinTableOneEmit
      this.wss
        .onEvent('joinTableOneEmit')
        .subscribe(data => this.joinTableOne(data));

      //leftTableOneEmit
      this.wss
        .onEvent('leftTableOneEmit')
        .subscribe(data => this.leftTableOne(data));

      //joinTableTwoEmit
      this.wss
        .onEvent('joinTableTwoEmit')
        .subscribe(data => this.logEvent(data));

      //joinTableThreeEmit
      this.wss
        .onEvent('joinTableThreeEmit')
        .subscribe(data => this.logEvent(data));
    }
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this.loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this.loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this.loadingBar.stop();
    }
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
