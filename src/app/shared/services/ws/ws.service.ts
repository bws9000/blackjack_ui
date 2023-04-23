import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject, Subject } from 'rxjs/internal/Subject';
import { SessionStorageService } from '../sessionStorage/session-storage.service';

// https://stackoverflow.com/questions/37025837/the-best-way-to-share-websocket-data-between-multiple-components-in-angular-2
export interface Message {
  source: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class WsService extends SessionStorageService {
  ws2: WebSocket;
  public messages: Subject<any> = new Subject<any>();
  public msg: any;

  init(): string {
    this.ws2 = new WebSocket('ws://localhost:3000');
    this.msg = this.initializeWebSocket2();
    this.msg.subscribe((msg: any) => {
      // socket ( KEEP MY OPERATIONS IN INDIVIDUAL COMPONENTS)
      console.log('WS_SERVICE IN: ' + msg.data);
      this.messages.next(msg.data); // internal
    });

    this.ws2.addEventListener('close', (event) => {
      // console.log(event); // CloseEvent
      this.setWSConnected(false);
      alert('Websocket Closed.');
    });

    return this.initialConnection();
  }

  send(msg: Object) {
    console.log('sending: ' + JSON.stringify(msg));
    this.msg.next(msg);
  }

  initializeWebSocket2(): any {
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      this.ws2.onmessage = obs.next.bind(obs);
      this.ws2.onerror = obs.error.bind(obs);
      this.ws2.onclose = obs.complete.bind(obs);
    });
    // }).pipe(share());
    let observer = {
      error: () => {},
      complete: () => {},
      next: (data: any) => {
        if (this.ws2.readyState === WebSocket.OPEN) {
          this.ws2.send(JSON.stringify(data));
          console.log('WS_SERVICE OUT: ', data);
        }
      },
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }

  initialConnection(): string {
    const wsConnection = sessionStorage.getItem('ws:connected');
    const handshake =
      '{"jsonrpc":"2.0", "method":"userInitialConnection", "params":[{"data": {"wsconnected":"false"}}, "latest"], "id":"2"}';
    return handshake;
    // this.messages = new Subject<any>();
    // this.send(JSON.parse(handshake));
  }

  closeWS(): void {
    if (this.ws2) {
      this.ws2.close();
    }
  }

  // public messages: any = new Subject<any>();
  // public wsObservalbe: Observable<any>;

  // constructor() {
  //   if (!this.messages) {
  //   this.messages = this.connect('ws://localhost:3000').pipe(
  //     map((response: MessageEvent): Message => {
  //       let data = JSON.parse(response.data);
  //       return data;
  //     })
  //   );
  //   }
  // }

  // initializeWebSocket(): Observable<any> {
  //   return new Observable((observer) => {
  //     this.ws2 = new WebSocket('ws://localhost:3000');

  //     this.ws2.onopen = (e) => {
  //       console.log('open happy');
  //     };

  //     this.ws2.onclose = (e) => {
  //       console.log(`close: ${JSON.stringify(e)}`);
  //       if (e.wasClean) {
  //         console.log('close: observer.complete()');
  //         observer.complete();
  //       } else {
  //         console.log('close: observer.error(e)');
  //         observer.error(e);
  //       }
  //     };

  //     this.ws2.onerror = (e) => {
  //       observer.error(e);
  //     };

  //     this.ws2.onmessage = (e) => {
  //       observer.next(JSON.parse(e.data));
  //     };

  //     return () => {
  //       this.ws2.close();
  //     };
  //   }).pipe(share());
  // }

  // private connect(url: any): AnonymousSubject<MessageEvent> {
  //   if (!this.subject) {
  //     this.subject = this.create(url);
  //     console.log('Successfully connected: ' + url);
  //   }
  //   return this.subject;
  // }

  // private create(url: any): AnonymousSubject<MessageEvent> {
  //   let ws = new WebSocket(url);
  //   let observable = new Observable((obs: Observer<MessageEvent>) => {
  //     ws.onmessage = obs.next.bind(obs);
  //     ws.onerror = obs.error.bind(obs);
  //     ws.onclose = obs.complete.bind(obs);
  //     return ws.close.bind(ws);
  //   });
  //   let observer = {
  //     error: () => {},
  //     complete: () => {},
  //     next: (data: any) => {
  //       console.log('Message sent to websocket: ', data);
  //       if (ws.readyState === WebSocket.OPEN) {
  //         ws.send(data);
  //       }
  //     },
  //   };
  //   return new AnonymousSubject<MessageEvent>(observer, observable);
  // }
}
