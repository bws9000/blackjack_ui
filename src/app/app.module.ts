import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {InitModule} from "./init/init.module";

export function initialize(initModule: InitModule) {
  return (): Promise<any> => {
    return initModule.init();
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    InitModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [InitModule,
    {provide: APP_INITIALIZER, useFactory: initialize, deps: [InitModule], multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
