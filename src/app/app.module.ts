import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketConnectService } from './socket-connect.service';
import { SocketStatusComponent } from './socket-status/socket-status.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageAboutComponent } from './page-about/page-about.component';

@NgModule({
  declarations: [
    AppComponent,
    SocketStatusComponent,
    NavbarComponent,
    PageAboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SocketConnectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
