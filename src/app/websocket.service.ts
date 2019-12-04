import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from "rxjs";
import {environment} from '../environments/environment';

//const SOCKET_SERVER = 'https://calm-eyrie-37824.herokuapp.com/blackjack';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket;
  public start: boolean;

  constructor() {
  }

  public onEvent(event: string): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on(event, (data: string) => observer.next(data));
    });
  }

  public emit(event:string,data: any) {
    this.socket.emit(event, data);
  }

  connect() {
    this.socket = io(environment.devsocketurl);
    this.start = true;
    //this.socket.emit('helloserver', {msg: 'client says hi'});
  }

  authConnect() {
    this.socket = io(environment.socketurl);
    return new Promise(resolve => {
      this.socket.on('connect', function () {
        this.emit('authentication', {devuser: environment.devpass});
        this.on('authenticated', function () {
          if (this.connected) {
            resolve(true);
            console.log('socket authenticated');
            this.start = true;
          }
        });
      });
    });

  }
}
