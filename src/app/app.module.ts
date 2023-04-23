import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './components/navigation/main/main.component';
import { InitAppService } from './init/init-app.service';
import { SessionStorageService } from './shared/services/sessionStorage/session-storage.service';
import { AuthGuard } from './auth.guard';
import { ModalModule } from './shared/modules/modal/modal.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupComponent } from './shared/components/popups/test/popup.component';
import { RobotCheckComponent } from './shared/components/popups/robot-check/robot-check.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterService } from './services/router/router.service';
import { ConnectComponent } from './game/blackjack/screens/connect/connect.component';
import { LoadingComponent } from './shared/components/loading/loading.component';

const routes: Routes = [
  {
    path: 'blackjack',
    loadChildren: () =>
      import('./game/module/blackjack.module').then((bj) => bj.BlackjackModule),
    canActivate: [AuthGuard]
  },
  // { path: 'connect', component:ConnectComponent},
  { path: '', component: MainComponent },
];
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PopupComponent,
    RobotCheckComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    ModalModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (init: InitAppService) => () => init.initialize(),
      deps: [InitAppService],
    },
    SessionStorageService,
    RouterService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
