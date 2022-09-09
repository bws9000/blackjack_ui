import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableSelectComponent} from "./table-select/table-select.component";
import {SocketConnectComponent} from "./socket-connect/socket-connect.component";
import {TableDetailComponent} from "./table-detail/table-detail.component";
import {AppComponent} from "./app.component";
import {GameHomeComponent} from "./game-home/game-home.component";
import {NotfoundComponent} from "./notfound/notfound.component";

const routes: Routes = [
  {
    path: '', component: GameHomeComponent
  },
  {
    path: 'tables', component: TableSelectComponent
  },
  {
    path: 'tables/:tableId', component: TableDetailComponent
  },
  {
    path: '**', pathMatch: 'full', component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
