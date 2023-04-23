import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private readonly siteKey = '6LcQjYslAAAAAALyRfUwuVNhgREeRYC1KmoZNlaj';
  public execute(): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      grecaptcha.enterprise.ready(() => {
        grecaptcha.enterprise
          .execute(this.siteKey, { action: 'submit' })
          .then((token: string) => {
            observer.next(token);
            observer.complete();
          });
      });
    });
  }
}
