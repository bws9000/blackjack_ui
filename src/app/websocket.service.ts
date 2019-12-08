import {Injectable, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, of, Subject} from "rxjs";
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket: io;
  start: boolean;
  startChange: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.start = false;
    this.startChange.subscribe((value) => {
      this.start = value
    });
  }

  public onEvent(event: string): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on(event, (data: string) => observer.next(data));
    });
  }

  public emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  authConnect() {
    let that = this;
    this.socket = io(environment.devsocketurl);
    console.log('socket: ' + environment.devsocketurl);
    return new Promise(resolve => {
      this.socket.on('connect', function () {
        this.emit('authentication', {devuser: environment.devpass});
        this.on('authenticated', function () {
          if (this.connected) {
            resolve(true);
            this.emit('init', {msg: ''});
            console.log('socket authenticated');
            that.startChange.next(true);
          }
        });
      });
    });
  }
}
