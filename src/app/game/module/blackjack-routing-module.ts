import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConnectComponent } from '../blackjack/screens/connect/connect.component';
import { InitialComponent } from '../blackjack/screens/initial/initial.component';
import { WebSocketConnectionComponent } from '../blackjack/screens/ws-connection/ws-connection.component';

const routes: Routes = [
  { path: 'test', component: InitialComponent },
  { path: 'connect', component: ConnectComponent },
  {
    path: '',
    component: WebSocketConnectionComponent,
    outlet: 'blackjack'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlackjackRoutingModule {}
