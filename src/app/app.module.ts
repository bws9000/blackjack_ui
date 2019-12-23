import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {SocketConnectComponent} from "./socket-connect/socket-connect.component";
import {AppComponent} from './app.component';

import {InitModule} from "./init/init.module";
import { TableSelectComponent } from './table-select/table-select.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import {WebsocketService} from "./websocket.service";
import { TableDetailComponent } from './table-detail/table-detail.component';
import { ControlComponent } from './control/control.component';

export function initialize(initModule: InitModule) {
  return (): Promise<any> => {
    return initModule.init();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SocketConnectComponent,
    TableSelectComponent,
    TableDetailComponent,
    ControlComponent
  ],
  imports: [
    InitModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SlimLoadingBarModule
  ],
  providers: [InitModule,
    {provide: APP_INITIALIZER, useFactory: initialize, deps: [InitModule], multi: true}
    ,WebsocketService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
