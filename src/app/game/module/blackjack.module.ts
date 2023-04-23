import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitialComponent } from '../blackjack/screens/initial/initial.component';
import { ConnectComponent } from '../blackjack/screens/connect/connect.component';
import { BlackjackRoutingModule } from './blackjack-routing-module';
import { WebSocketConnectionComponent } from '../blackjack/screens/ws-connection/ws-connection.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
@NgModule({
  declarations: [
    InitialComponent,
    LoadingComponent,
    WebSocketConnectionComponent,
    ConnectComponent,
  ],
  imports: [CommonModule, BlackjackRoutingModule],
  providers: [],
  exports: [],
})
export class BlackjackModule {}
