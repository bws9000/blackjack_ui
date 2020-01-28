import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from "rxjs";
import {environment} from '../../environments/environment';
import {SocketObservable} from "../SocketObservable";

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

  constructor() {
    let that = this;

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
    this.startChange.next(false);
    this.socket.emit(event, data);
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
        console.log('you have been reconnected');
        that.reconnected();
      });
    });
  }

  disconnect() {
    this.socket.io.disconnect();
  }

  public initEvents() {
    //USER EVENTS
    //this.eventMap.set('createTableEmit', new SocketObservable('createTableEmit', this.socket))
    this.eventMap.set('getHandsEmit', new SocketObservable('getHandsEmit', this.socket));
    this.eventMap.set('initEmit', new SocketObservable('initEmit', this.socket));
    this.eventMap.set('memberOfRoomEmit', new SocketObservable('memberOfRoomEmit', this.socket));
    this.eventMap.set('joinTableEmit', new SocketObservable('joinTableEmit', this.socket));
    this.eventMap.set('leftTableEmit', new SocketObservable('leftTableEmit', this.socket));
    this.eventMap.set('standUpTableEmit', new SocketObservable('standUpTableEmit', this.socket));
    this.eventMap.set('satDownTableEmit', new SocketObservable('satDownTableEmit', this.socket));
    this.eventMap.set('playersBettingEmit', new SocketObservable('playersBettingEmit', this.socket));
    this.eventMap.set('nextPlayerBetEmit', new SocketObservable('nextPlayerBetEmit', this.socket));
    this.eventMap.set('actionStatusEmit', new SocketObservable('actionStatusEmit', this.socket));
    //ENVIRONMENT EVENTS
    this.eventMap.set('tableDetailHeartBeat', new SocketObservable('tableDetailHeartBeat', this.socket));
    this.eventMap.set('socketReconnect', new SocketObservable('socketReconnect', this.socket));
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }
}
