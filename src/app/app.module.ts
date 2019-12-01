import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SocketStatusComponent} from "../socket-status/socket-status.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {PageAboutComponent} from "../page-about/page-about.component";

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
