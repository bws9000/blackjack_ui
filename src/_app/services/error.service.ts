import {Injectable} from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ErrorService {

  error: Subject<Object> = new Subject<Object>();

  constructor() {
  }

  handleError(num: number, text: string) {
    let data = {errorNum: num, errorText: text};
    this.error.next(data);
  }

}
