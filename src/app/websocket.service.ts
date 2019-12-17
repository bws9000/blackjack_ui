import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from "rxjs";
import {environment} from '../environments/environment';
import {SocketObservable} from "./SocketObservable";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService{

  public socket: io;
  socketUrl:string;
  start: boolean = false;
  public startChange: Subject<boolean> = new Subject<boolean>();
  eventMap: Map<string, SocketObservable> = new Map<string, SocketObservable>();

  constructor() {
    this.logStuff('WEBSOCKETSERVICE CONSTRUCTOR CALLED');
    this.socketUrl = (environment.production) ?
      'https://calm-eyrie-37824.herokuapp.com/blackjack' : 'http://localhost:3000/blackjack';
    this.start = false;
    this.startChange.subscribe((value) => {
      this.start = value;
    });
  }

  getSocket(){
    return this.socket;
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
      this.socket.on('connect', function () {
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
    });
  }

  public initEvents() {
    //USER EVENTS
    this.eventMap.set('initEmit', new SocketObservable('initEmit', this.socket));
    //this.eventMap.set('createTableEmit', new SocketObservable('createTableEmit', this.socket))
    this.eventMap.set('joinTableOneEmit', new SocketObservable('joinTableOneEmit',this.socket));
    this.eventMap.set('leftTableOneEmit', new SocketObservable('leftTableOneEmit',this.socket));
    this.eventMap.set('joinTableTwoEmit', new SocketObservable('joinTableTwoEmit',this.socket));
    this.eventMap.set('joinTableThreeEmit', new SocketObservable('joinTableThreeEmit',this.socket));
    this.eventMap.set('satDownAtTableOneEmit', new SocketObservable('satDownAtTableOneEmit',this.socket));
    //ENVIRONMENT EVENTS
    this.eventMap.set('watchersUpdatedEmit', new SocketObservable('watchersUpdatedEmit',this.socket));
    this.eventMap.set('playersUpdatedEmit', new SocketObservable('playersUpdatedEmit',this.socket));

  }

  logStuff(stuff:any){
    if(!environment.production){
      console.log(stuff);
    }
  }
}
