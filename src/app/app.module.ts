import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { SocketConnectService } from './socket-connect.service';
import { SocketStatusComponent } from './socket-status/socket-status.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    SocketStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SocketConnectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
