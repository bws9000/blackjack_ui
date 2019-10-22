import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { resolve } from 'q';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocketConnectService {
  private url = 'https://calm-eyrie-37824.herokuapp.com/blackjack';
  private socket;
  constructor() {
    this.socket = io(this.url);
  }
  authConnect() {
    return new Promise(resolve => {
      this.socket.on('connect', function () {
        this.emit('authentication', { devuser: 'bws9000' });
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
}