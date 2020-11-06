import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from "rxjs";
import {environment} from '../../environments/environment';
import {SocketObservable} from "../SocketObservable";
import {Router} from "@angular/router";
import {ControlService} from "./control.service";
import {CheckIllegalEmits} from "../CheckIllegalEmits";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socket: io;
  socketUrl: string;
  start: boolean = false;
  public startChange: Subject<boolean> = new Subject<boolean>();
  eventMap: Map<string, SocketObservable> = new Map<string, SocketObservable>();
  socketId: string;

  constructor(private router: Router,
              private control: ControlService) {

    this.logStuff('WEBSOCKETSERVICE CONSTRUCTOR CALLED');
    this.socketUrl = (environment.production) ?
      'https://calm-eyrie-37824.herokuapp.com/blackjack' : 'http://localhost:3000/blackjack';
    this.start = false;
    this.startChange.subscribe((value) => {
      this.start = value;
    });

  }

  reconnected() {
    this.socket.emit('userReconnected', {room: 'reconnect'});
  }

  public onEvent(event: string): Observable<any> {
    let so = this.eventMap.get(event);
    return so.getEvent();
  }

  public emit(event: string, data: any) {
    // this.logStuff('--------------');
    // this.logStuff('gamePostion: ' + this.control.gamePosition);
    // this.logStuff('emit url'+this.router.routerState.snapshot.url);
    // this.logStuff('--------------');
    this.logStuff('EMIT: ' + event);

    switch (this.control.gamePosition) {
      case 0:
        this.checkGameHome(event, data);
        break;
      case 1:
        this.checkTableSelect(event, data);
        break;
      case 2:
        this.checkTableDetail(event, data);
        break;
    }
  }

  checkGameHome(event, data) {
    if (!CheckIllegalEmits.gameHome.checkForIllegals(event)) {
      this.startChange.next(false);
      this.socket.emit(event, data);
    }
  }

  checkTableSelect(event,data) {
    console.log('HOWDY');
    if (!CheckIllegalEmits.tableSelect.checkForIllegals(event)) {
      this.startChange.next(false);
      this.socket.emit(event, data);
    }
  }

  checkTableDetail(event,data) {
    if (!CheckIllegalEmits.tableDetail.checkForIllegals(event)) {
      this.startChange.next(false);
      this.socket.emit(event, data);
    }
  }

  authConnect() {
    let that = this;

    this.socket = io(this.socketUrl);
    this.logStuff('socket: ' + this.socketUrl);

    return new Promise(resolve => {
      this.socket.once('connect', function () {
        that.emit('authentication', {devuser: environment.devpass});
        this.on('authenticated', function () {
          if (this.connected) {
            resolve(true);
            this.emit('init', {msg: ''});
            that.logStuff('socket authenticated');
            that.startChange.next(true);
          }
        });
      });
      //on reconnect
      this.socket.on('reconnect', function () {
        that.logStuff('you have been reconnected');
        that.reconnected();
      });
    });
  }

  disconnect() {
    this.socket.io.disconnect();
  }

  public initEvents() {
    //USER EVENTS
    this.eventMap.set('getTablesEmit', new SocketObservable('getTablesEmit', this.socket))
    this.eventMap.set('getHandsEmit', new SocketObservable('getHandsEmit', this.socket));
    this.eventMap.set('initEmit', new SocketObservable('initEmit', this.socket));
    this.eventMap.set('memberOfRoomEmit', new SocketObservable('memberOfRoomEmit', this.socket));
    this.eventMap.set('joinTableEmit', new SocketObservable('joinTableEmit', this.socket));
    this.eventMap.set('addTableEmit', new SocketObservable('addTableEmit', this.socket));
    this.eventMap.set('leftTableEmit', new SocketObservable('leftTableEmit', this.socket));
    this.eventMap.set('standUpTableEmit', new SocketObservable('standUpTableEmit', this.socket));
    this.eventMap.set('satDownTableEmit', new SocketObservable('satDownTableEmit', this.socket));
    this.eventMap.set('openBetDashEmit', new SocketObservable('openBetDashEmit', this.socket));
    this.eventMap.set('dealCardEmit', new SocketObservable('dealCardEmit', this.socket));
    this.eventMap.set('openPlayerDashEmit', new SocketObservable('openPlayerDashEmit', this.socket));
    this.eventMap.set('actionStatusEmit', new SocketObservable('actionStatusEmit', this.socket));
    this.eventMap.set('playerActionEmit', new SocketObservable('playerActionEmit', this.socket));
    this.eventMap.set('actionSeatEmit', new SocketObservable('actionSeatEmit', this.socket));
    this.eventMap.set('dealerHandEmit', new SocketObservable('dealerHandEmit', this.socket));
    this.eventMap.set('restartHandsEmit', new SocketObservable('restartHandsEmit', this.socket));
    this.eventMap.set('checkDoneEmit', new SocketObservable('checkDoneEmit', this.socket));
    this.eventMap.set('initSplitEmit', new SocketObservable('initSplitEmit', this.socket));
    this.eventMap.set('getAllTablesEmit', new SocketObservable('getAllTablesEmit', this.socket));
    this.eventMap.set('getTableStateEmit', new SocketObservable('getTableStateEmit', this.socket));
    //ENVIRONMENT EVENTS
    this.eventMap.set('tableDetailHeartBeat', new SocketObservable('tableDetailHeartBeat', this.socket));
    this.eventMap.set('socketReconnect', new SocketObservable('socketReconnect', this.socket));
    this.eventMap.set('errorEmit', new SocketObservable('errorEmit', this.socket));
    this.eventMap.set('blankEmit', new SocketObservable('blankEmit', this.socket));
    this.eventMap.set('emptyEmit', new SocketObservable('emptyEmit', this.socket));
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }
}
