import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocketStatusComponent } from './socket-status/socket-status.component';

const routes: Routes = [{ path: '', component: SocketStatusComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
