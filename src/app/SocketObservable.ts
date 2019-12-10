import {Observable} from "rxjs";

export class SocketObservable {
  onEventObservable: Observable<string>;

  constructor(event, socket) {
    this.onEventObservable = new Observable((observer) => {
      socket.on(event, (data: string) => observer.next(data));
    });
  }
  getEvent(): Observable<any> {
    return this.onEventObservable;
  }
}
