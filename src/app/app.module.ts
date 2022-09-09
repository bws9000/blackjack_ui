import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {SocketConnectComponent} from "./socket-connect/socket-connect.component";
import {AppComponent} from './app.component';

import {InitModule} from "./init/init.module";
import {TableSelectComponent} from './table-select/table-select.component';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import {WebsocketService} from "./services/websocket.service";
import {TableDetailComponent} from './table-detail/table-detail.component';
import {ControlComponent} from './control/control.component';
import {PlayerboxComponent} from './playerbox/playerbox.component';
import {SitComponent} from './sit/sit.component';
import {PlayerHandComponent} from './player-hand/player-hand.component';
import {DealerHandComponent} from './dealer-hand/dealer-hand.component';
import {PlaceBetsComponent} from './place-bets/place-bets.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StatusMessageComponent} from './status-message/status-message.component';
import {PlayerDashComponent} from './player-dash/player-dash.component';
import {MultiDashComponent} from './multi-dash/multi-dash.component';
import {GameHomeComponent} from './game-home/game-home.component';
import {SplitDashComponent} from './split-dash/split-dash.component';
import {MapToIterablePipe} from './map-to-iterable.pipe';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DialogExampleComponent} from './dialog-example/dialog-example.component';
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { NotfoundComponent } from './notfound/notfound.component';
import {MatSelectModule} from "@angular/material/select";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";


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
        ControlComponent,
        PlayerboxComponent,
        SitComponent,
        PlayerHandComponent,
        DealerHandComponent,
        PlaceBetsComponent,
        StatusMessageComponent,
        PlayerDashComponent,
        MultiDashComponent,
        GameHomeComponent,
        SplitDashComponent,
        MapToIterablePipe,
        DialogExampleComponent,
        NotfoundComponent
    ],
    imports: [
        InitModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SlimLoadingBarModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule,
        MatSlideToggleModule,
        FormsModule,
        MatSelectModule,
        MatCardModule,
        MatListModule
    ],
    providers: [InitModule,
        //{provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
        { provide: APP_INITIALIZER, useFactory: initialize, deps: [InitModule], multi: true },
        WebsocketService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
