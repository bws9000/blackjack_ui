import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageAboutComponent } from '../page-about/page-about.component';
import { SocketStatusComponent } from '../socket-status/socket-status.component';

const routes: Routes = [
  { path: '', component: SocketStatusComponent },
  { path: 'about', component: PageAboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
