import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class InitModule {

  private appUrl = (environment.production) ?
    'https://multiplayer.blackjackgame.us' : 'http://localhost:5000';
  env;

  constructor(private http: HttpClient) {
    this.preloadCards();
  }

  init() {

    return new Promise<void>((resolve, reject) => {
      this.logStuff("init.module");
      return this.getEnv()
        .subscribe((data: '') => {
          let s = JSON.stringify(data);
          this.env = JSON.parse(s);
          environment.devpass = this.env.devpass;
          environment.socketurl = this.env.socketurl;
          environment.devsocketurl = this.env.devsocketurl;
          //console.log(environment.devsocketurl);
          //console.log(environment.devpass);
          //console.log(environment.socketurl);
          resolve();
        });

    });
  }

  preloadCards() {
    let cardPreloadTest = [];
    for (let i = 0; i < 52; i++) {
      cardPreloadTest[i] = '../../assets/deck1/' + i + '.png';
    }
  }

  getEnv() {
    this.logStuff('environment: ' + this.appUrl);
    return this
      .http
      .get(`${this.appUrl}/env`, {responseType: 'json'});
  }

  logStuff(stuff: any) {
    if (!environment.production) {
      console.log(stuff);
    }
  }

}
