import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router, RoutesRecognized } from '@angular/router';
import { Subject } from 'rxjs';
import { InitAppService } from 'src/app/init/init-app.service';
import { RouterService } from 'src/app/services/router/router.service';
//import { LocalStorageService } from 'src/app/shared/services/localStorage/localstorage.service';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage/session-storage.service';
import { WsService } from 'src/app/shared/services/ws/ws.service';

@Component({
  selector: 'app-home',
  templateUrl: './ws-connection.component.html',
  styleUrls: ['./ws-connection.component.scss'],
})

/*
blackjack game home
entry point to "connect" to websocket ( WHEN SOCKET ID IS ISSUED )
*/
export class WebSocketConnectionComponent {
  checkCLIENTSTATE: any;

  constructor(
    private sessionStorageService: SessionStorageService,
    private wsService: WsService,
    private router: Router, // private activatedRoute: ActivatedRoute
    private initAppService: InitAppService
  ) {
    if (!wsService.msg) {
      console.log('HOMECOMPONENT: websocket initialized');
      const handshake = this.wsService.init();

      this.wsService.messages = new Subject<any>();
      this.wsService.messages.subscribe((message) => {
        console.log('message from home component: ' + message);
        const checkPong = JSON.parse(message);
        if (checkPong.type === 'pong') {
          console.log('pong');
        } else {
          const msg = JSON.parse(message).result;
          if (msg?.success) {
            this.sessionStorageService.setWSConnected(true);
            this.sessionStorageService.setUserSocketID(msg.data.sid);
            this.initAppService.setLoadingWS(false); // LOADED
          }
        }
      });

      setTimeout(() => {
        this.wsService.send(JSON.parse(handshake));
      }, 1000);

      setInterval(() => {
        if (this.sessionStorageService.getWSConnected() === 'true') {
          this.wsService.send(JSON.parse('{"type":"ping"}'));
        }
      }, 30000);

      /* if no socket id etc... is found close flush everything */
      this.checkCLIENTSTATE = setInterval(() => {
        const sid = this.sessionStorageService.getUserSocketID() ?? false;
        if (!sid) {
          if (
            !this.initAppService.getLoadingWS() &&
            !this.initAppService.getLoadingGoogleCaptcha()
          ) {
            this.flushSettings();
          }
        }

        const possibleRobot =
          this.sessionStorageService.getUserPossiblyRobot() ?? false;
        if (!possibleRobot || possibleRobot === 'true') {
          if (
            !this.initAppService.getLoadingWS() &&
            !this.initAppService.getLoadingGoogleCaptcha()
          ) {
            this.flushSettings();
          }
        }

        const wsconnected =
          this.sessionStorageService.getWSConnected() ?? false;
        if (!wsconnected || wsconnected === 'false') {
          if (
            !this.initAppService.getLoadingWS() &&
            !this.initAppService.getLoadingGoogleCaptcha()
          ) {
            this.flushSettings();
          }
        }
      }, 500);
    }
  }

  flushSettings(): void {
    this.wsService.closeWS();
    this.wsService.msg = undefined;
    this.sessionStorageService.clear();
    this.router.navigate(['/']);
    clearInterval(this.checkCLIENTSTATE);
  }


  ngOnInit() {
    // this.router.events.subscribe(event => {
    //   if (event instanceof RoutesRecognized) {
    //     console.log('Route configuration:', event.state.root);
    //   }
    // });
  }
}

// constructor(private wsService: WsService) {
//   this.wsService.messages = new Subject<any>(); // avoid message pile-up
//   this.wsService.messages.subscribe((message)=>{
//     // console.log(message);
//   })
// }
