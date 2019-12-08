import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
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

@Component({
  providers: [WebsocketService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef,
              private loadingBar: SlimLoadingBarService,
              private wss: WebsocketService,
              private router: Router) {
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'black';
  }

  onConnect(data: any) {
    let result = JSON.stringify((data));
    console.log(result);
  }

  ngOnInit(): void {
    if (this.wss.authConnect()) {
      console.log('connected now');
    }
    this.wss
      .onEvent('initEmit')
      .subscribe(data => this.onConnect(data));
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

}
