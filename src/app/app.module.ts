import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalDialogModule } from './shared/modules/modal-dialog/modal-dialog.module';
//import { ModalService } from './shared/modules/modal-dialog/modal.service';
@NgModule({
    declarations: [
      AppComponent
    ],
    exports:[],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ModalDialogModule,
    ],
    //providers: [ModalService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
