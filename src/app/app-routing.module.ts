import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TableSelectComponent} from "./table-select/table-select.component";
import {SocketConnectComponent} from "./socket-connect/socket-connect.component";
import {TableDetailComponent} from "./table-detail/table-detail.component";

const routes: Routes = [
  {
    path: '', component: SocketConnectComponent
  },
  {
    path: 'tables', component: TableSelectComponent
  },
  {
    path: 'tables/:tableId', component: TableDetailComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
