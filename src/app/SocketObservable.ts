import {Observable} from "rxjs";

export class SocketObservable {
  onEventObservable: Observable<string>;
  event:any;
  socket:any;

  constructor(event, socket) {
    this.event = event;
    this.socket = socket;

    this.onEventObservable = new Observable((observer) => {
      socket.on(event, (data: string) => observer.next(data));
    });
  }
  getEvent(): Observable<any> {
    return this.onEventObservable;
  }
}
