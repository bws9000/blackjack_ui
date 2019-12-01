import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SocketConnectService {

  /*
  private url = '';
  private socket;
  constructor() {
    this.socket = io(this.url);
  }
  authConnect() {
    return new Promise(resolve => {
      this.socket.on('connect', function () {
        this.emit('authentication', { devuser: environment.DEV_PASS });
        this.on('authenticated', function () {
          if (this.connected) {
            resolve(true);
          }
        });
      });
    });
  }
  getInitInfo(){
      this.socket.emit('init','');
      return Observable.create((observer) => {
        this.socket.on('initEmit', (data) => {
          if (data) {
            observer.next(data);
          } else {
            observer.error('getInitInfo() error');
          }
        });
      });
  }
  getSocket() {
    return this.socket;
  }
  */
}
