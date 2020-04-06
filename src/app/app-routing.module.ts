import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableSelectComponent} from "./table-select/table-select.component";
import {SocketConnectComponent} from "./socket-connect/socket-connect.component";
import {TableDetailComponent} from "./table-detail/table-detail.component";
import {AppComponent} from "./app.component";
import {GameHomeComponent} from "./game-home/game-home.component";

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
