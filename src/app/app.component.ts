import { Component, Inject, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalServiceService } from './shared/modules/modal/services/modal-service.service';
import { Router, RoutesRecognized } from '@angular/router';
import { WsService } from './shared/services/ws/ws.service';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})

export class AppComponent {
  title = 'blackjack';
  constructor(
    @Inject(ViewContainerRef) viewContainerRef:any,
    private modalService: ModalServiceService,
    private wsService: WsService){
      this.modalService.setModalHost(viewContainerRef);
      if(!this.wsService.ws2){
        sessionStorage.clear();
      }
  }
}
