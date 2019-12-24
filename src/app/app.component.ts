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
import {StatusUpdateService} from "./status-update.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  loadingWheelVisible: string;
  isHidden:boolean;

  constructor(private loadingBar: SlimLoadingBarService,
              private wss: WebsocketService,
              private statusUpdateService: StatusUpdateService,
              private router: Router) {


    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });

    this.wss.startChange.subscribe(value => {
      if (value) {
        this.loadingWheelVisible = 'hidden';
      } else {
        this.loadingWheelVisible = 'visible';
      }
    });

    this.statusUpdateService.navBarVisible.subscribe(value => {
      this.isHidden = !value;
    });
    this.statusUpdateService.hideNavBar(true);

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
    this.router.navigate(['/tables/tableone']);
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  leftTableOne(data) {
    this.wss.startChange.next(true);
    this.router.navigate(['/tables']);
    let result = JSON.stringify((data));
    this.logStuff(result);
  }

  socketReconnect(data) {
    this.router.navigate(['']);
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


      /////////////////// User Events /////////////////////////
      /////////////////////////////////////////////////////////

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

      ////////////////// Environment Updates //////////////////////
      /////////////////////////////////////////////////////////////
      //
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
