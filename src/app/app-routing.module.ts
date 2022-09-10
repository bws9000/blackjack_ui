import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameHomeComponent } from './shared/components/game-home/game-home.component';

const routes: Routes = [
   { path: "", component: GameHomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
