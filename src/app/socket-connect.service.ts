import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketConnectService {
  private url = 'https://calm-eyrie-37824.herokuapp.com/blackjack';
  private socket;
  constructor() {
    this.socket = io(this.url);
  }
  getSocket() {
    return this.socket;
  }
}